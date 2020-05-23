package routes

import (
	"encoding/json"
	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
	"log"
	"net/http"
)

type PurchaseRequest struct {
	Symbol string `json:"symbol"`
	Amount int    `json:"amount"`
}

func (app *App) PurchaseSymbol(w http.ResponseWriter, r *http.Request) {
	authCookie, err := r.Cookie("jwt-token")
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	type Claims struct {
		Email string `json:"email"`
		ID    string `json:"id"`
		jwt.StandardClaims
	}
	tokenString := authCookie.Value
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return tokenSignature, nil
	})
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	if !token.Valid {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	var pr PurchaseRequest
	err = json.NewDecoder(r.Body).Decode(&pr)
	if err != nil {
		log.Fatal(err)
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("error asserting claims"))
		return
	}
	user, err := app.getUserByID(claims.ID)
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
