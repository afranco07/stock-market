package routes

import (
	"encoding/json"
	"net/http"
)

type listStock struct {
	Symbol      string               `json:"symbol"`
	Amount      int                  `json:"amount"`
	TotalPrice  float32              `json:"total_price"`
	Performance performanceIndicator `json:"performance,omitempty"`
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

	rows, err := app.DB.Query(`SELECT symbol, sum(amount) as amount, sum(price * amount) as total FROM stocks WHERE account = $1 GROUP BY symbol`, c.ID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
	}
	defer rows.Close()

	stocks := make([]listStock, 0)
	for rows != nil && rows.Next() {
		var s listStock
		err := rows.Scan(&s.Symbol, &s.Amount, &s.TotalPrice)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}
		s.Performance, err = app.checkPerformance(s.Symbol, c.ID, &s.TotalPrice)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			errBytes, _ := json.Marshal(&struct {
				Error string `json:"error"`
			}{err.Error()})
			w.Header().Set("Content-Type", "application/json")
			w.Write(errBytes)
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

type performanceIndicator string

const (
	negativePerformance performanceIndicator = "red"
	positivePerformance performanceIndicator = "green"
	neutralPerformance  performanceIndicator = "grey"
)

func (app *App) checkPerformance(symbol, id string, price *float32) (performanceIndicator, error) {
	quote, err := apiCallGlobalQuote(symbol)
	if err != nil {
		return neutralPerformance, err
	}

	var total int
	err = app.DB.QueryRow(
		"select sum(amount) from stocks where account = $1 and symbol = $2",
		id,
		symbol,
	).Scan(&total)
	if err != nil {
		return neutralPerformance, err
	}
	currentTotalPrice := quote.Price * float32(total)

	if *price > currentTotalPrice {
		return negativePerformance, nil
	}

	if currentTotalPrice > *price {
		return positivePerformance, nil
	}

	*price = currentTotalPrice

	return neutralPerformance, nil
}
