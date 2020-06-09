package routes

import (
	"encoding/json"
	"net/http"
)

type portfolioList struct {
	Symbol string `json:"symbol"`
	Amount int    `json:"amount"`
}

// GetPortfolioPerformance returns the current total price of all stocks
func (app *App) GetPortfolioPerformance(w http.ResponseWriter, r *http.Request) {
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

	rows, err := app.DB.Query("SELECT DISTINCT symbol, sum(amount) FROM stocks WHERE account = $1 GROUP BY symbol", c.ID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
	}
	defer rows.Close()

	list := make([]portfolioList, 0)
	for rows != nil && rows.Next() {
		var pl portfolioList
		err := rows.Scan(&pl.Symbol, &pl.Amount)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}
		list = append(list, pl)
	}

	var totalCash float32
	for _, v := range list {
		quote, err := apiCallGlobalQuote(v.Symbol)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			errBytes, _ := json.Marshal(&struct {
				Error string `json:"error"`
			}{err.Error()})
			w.Header().Set("Content-Type", "application/json")
			w.Write(errBytes)
			return
		}
		totalCash += quote.Price * float32(v.Amount)
	}

	cashBytes, err := json.Marshal(struct {
		TotalCash float32 `json:"total_cash"`
	}{totalCash})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(cashBytes)
}
