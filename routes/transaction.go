package routes

import (
	"encoding/json"
	"net/http"
)

type transaction struct {
	Action string  `json:"action"`
	Symbol string  `json:"symbol"`
	Amount int     `json:"amount"`
	Price  float32 `json:"price"`
}

// ListTransactions returns all of the users transactions
func (app *App) ListTransactions(w http.ResponseWriter, r *http.Request) {
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

	rows, err := app.DB.Query("SELECT action, symbol, amount, price FROM transactions WHERE account = $1", c.ID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	defer rows.Close()

	transactions := make([]transaction, 0)
	for rows != nil && rows.Next() {
		var t transaction
		err := rows.Scan(&t.Action, &t.Symbol, &t.Amount, &t.Price)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}
		transactions = append(transactions, t)
	}

	transBytes, err := json.Marshal(transactions)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(transBytes)
}
