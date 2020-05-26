package routes

import (
	"encoding/json"
	"github.com/google/uuid"
	"net/http"
)

type PurchaseRequest struct {
	Symbol string `json:"symbol"`
	Amount int    `json:"amount"`
}

type stock struct {
	Symbol      string               `json:"symbol"`
	Price       float32              `json:"price"`
	Amount      int                  `json:"amount"`
	Performance performanceIndicator `json:"performance"`
}

// PurchaseSymbol buys r.amount stocks of symbol r.symbol
func (app *App) PurchaseSymbol(w http.ResponseWriter, r *http.Request) {
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

	var pr PurchaseRequest
	err := json.NewDecoder(r.Body).Decode(&pr)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("error decoding r.body"))
		return
	}

	user, err := app.getUserByID(c.ID)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	quote, err := apiCallGlobalQuote(pr.Symbol)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	err = app.insertStock(quote, &user, pr.Amount)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("error inserting purchase data"))
		return
	}

	s := stock{
		Symbol: quote.Symbol,
		Price:  quote.Price,
		Amount: pr.Amount,
	}
	stockBytes, err := json.Marshal(s)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(stockBytes)
}

func (app *App) insertStock(quote globalQuote, user *User, quantity int) error {
	id := uuid.New().String()
	_, err := app.DB.Exec("INSERT INTO stocks VALUES ($1, $2, $3, $4, $5)",
		id,
		user.ID,
		quote.Symbol,
		quote.Price,
		quantity,
	)
	if err != nil {
		return err
	}

	_, err = app.DB.Exec("INSERT INTO transactions(account, action, symbol, amount, price) VALUES ($1, $2, $3, $4, $5)", user.ID, "BUY", quote.Symbol, quantity, quote.Price)
	if err != nil {
		return err
	}

	newBalance := user.Cash - quote.Price
	_, err = app.DB.Exec("UPDATE account SET cash = $1 WHERE id = $2", newBalance, user.ID)
	if err != nil {
		return err
	}
	return nil
}
