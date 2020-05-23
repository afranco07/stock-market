package routes

import (
	"encoding/json"
	"net/http"
)

type stock struct {
	Symbol string  `json:"symbol"`
	Price  float32 `json:"price"`
	Amount int     `json:"amount"`
}

// ListStocks lists all of the users stocks
func (app *App) ListStocks(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value("claims")
	if claims == nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	c, ok := claims.(*jwtClaims)
	if !ok {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("error type asserting claims"))
		return
	}

	rows, err := app.DB.Query("SELECT symbol, price, amount FROM stocks WHERE account = $1", c.ID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
	}
	defer rows.Close()

	var stocks []stock
	for rows.Next() {
		var s stock
		err := rows.Scan(&s.Symbol, &s.Price, &s.Amount)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}
		stocks = append(stocks, s)
	}

	stockBytes, err := json.Marshal(stocks)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(stockBytes)
}
