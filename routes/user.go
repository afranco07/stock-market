package routes

import (
	"encoding/json"
	"errors"
	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
	"io"
	"net/http"
	"os"
)

const startCash = 5000

var tokenSignature = []byte(os.Getenv("TOKEN_SIG"))

// User represents the user table
type User struct {
	ID       string  `json:"id,omitempty"`
	Email    string  `json:"email"`
	Password string  `json:"password"`
	Cash     float32 `json:"cash,omitempty"`
}

// CreateUser is the post endpoint that creates the user
// and initializes the default user's cash to 5000
func (app *App) CreateUser(w http.ResponseWriter, r *http.Request) {
	var u User

	err := json.NewDecoder(r.Body).Decode(&u)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	u.ID = uuid.New().String()
	_, err = app.DB.Exec("INSERT INTO account VALUES ($1, $2, $3, $4)", u.ID, u.Email, u.Password, startCash)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}
}

// LoginUser checks jwt, logs in the user, and sets jwt cookie
func (app *App) LoginUser(w http.ResponseWriter, r *http.Request) {
	user, err := app.getUser(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": user.Email,
		"id":    user.ID,
	})

	tokenString, err := token.SignedString(tokenSignature)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(err.Error()))
		return
	}

	cookie := http.Cookie{
		Name:  "jwt-token",
		Value: tokenString,
	}
	http.SetCookie(w, &cookie)
}

func (app *App) getUser(r io.Reader) (User, error) {
	var requestUser User

	err := json.NewDecoder(r).Decode(&requestUser)
	if err != nil {
		return requestUser, err
	}

	var queryUser User
	err = app.DB.QueryRow(
		"SELECT id, email, password, cash FROM account WHERE email = $1",
		requestUser.Email,
	).Scan(&queryUser.ID, &queryUser.Email, &queryUser.Password, &queryUser.Cash)
	if err != nil {
		return requestUser, err
	}

	if requestUser.Password != queryUser.Password {
		return requestUser, errors.New("email or password incorrect")
	}

	return queryUser, nil
}

func (app *App) getUserByID(id string) (User, error) {
	var u User

	err := app.DB.QueryRow(
		"SELECT id, email, password, cash FROM account WHERE id = $1",
		id,
	).Scan(&u.ID, &u.Email, &u.Password, &u.Cash)
	if err != nil {
		return u, err
	}

	return u, nil
}
