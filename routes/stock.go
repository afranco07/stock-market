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
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	err = app.insertStock(quote, &user, pr.Amount)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("error inserting purchase data"))
		return
	}
}

func (app *App) insertStock(quote globalQuote, user *User, quantity int) error {
	id := uuid.New().String()
	_, err := app.DB.Exec("INSERT INTO stocks VALUES ($1, $2, $3, $4, $5)", id, user.ID, quote.Symbol, quote.Price, quantity)
	if err != nil {
		return err
	}
	return nil
}
