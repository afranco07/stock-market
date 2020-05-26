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
	Name     string  `json:"name,omitempty"`
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
	_, err = app.DB.Exec("INSERT INTO account VALUES ($1, $2, $3, $4, $5)", u.ID, u.Name, u.Email, u.Password, startCash)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	w.WriteHeader(http.StatusCreated)
}

// LoginUser checks jwt, logs in the user, and sets jwt cookie
func (app *App) LoginUser(w http.ResponseWriter, r *http.Request) {
	user, err := app.getUser(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	err = generateTokens(w, user.ID)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(err.Error()))
		return
	}
}

func generateTokens(w http.ResponseWriter, userID string) error {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		//"email": user.Email,
		"id": userID,
		//"exp": time.Now().Add(time.Minute * 1).Unix(),
	})

	tokenString, err := token.SignedString(tokenSignature)
	if err != nil {
		//w.WriteHeader(http.StatusUnauthorized)
		//w.Write([]byte(err.Error()))
		return err
	}

	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id": userID,
		//"exp": time.Now().Add(time.Minute * 3).Unix(),
	})

	rtString, err := refreshToken.SignedString(tokenSignature)
	if err != nil {
		//w.WriteHeader(http.StatusUnauthorized)
		//w.Write([]byte(err.Error()))
		return err
	}

	cookie := http.Cookie{
		Name:  "jwt-token",
		Value: tokenString,
	}
	refreshCookie := http.Cookie{
		Name:  "jwt-refresh-token",
		Value: rtString,
	}
	http.SetCookie(w, &cookie)
	http.SetCookie(w, &refreshCookie)

	return nil
}

func (app *App) getUser(r io.Reader) (User, error) {
	var requestUser User

	err := json.NewDecoder(r).Decode(&requestUser)
	if err != nil {
		return requestUser, err
	}

	var queryUser User
	err = app.DB.QueryRow(
		"SELECT id, name, email, password, cash FROM account WHERE email = $1",
		requestUser.Email,
	).Scan(&queryUser.ID, &queryUser.Name, &queryUser.Email, &queryUser.Password, &queryUser.Cash)
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
		"SELECT id, name, email, password, cash FROM account WHERE id = $1",
		id,
	).Scan(&u.ID, &u.Name, &u.Email, &u.Password, &u.Cash)
	if err != nil {
		return u, err
	}

	return u, nil
}

// GetCash returns the users current balance
func (app *App) GetCash(w http.ResponseWriter, r *http.Request) {
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

	u, err := app.getUserByID(c.ID)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	jsonBytes, err := json.Marshal(struct {
		Cash float32 `json:"cash"`
	}{u.Cash})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonBytes)
}
