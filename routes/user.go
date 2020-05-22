package routes

import (
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"log"
	"net/http"
)

const startCash = 5000

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
		log.Fatal(err)
	}
	u.ID = uuid.New().String()
	_, err = app.DB.Exec("insert into account values ($1, $2, $3, $4)", u.ID, u.Email, u.Password, startCash)
	if err != nil {
		log.Fatal(err)
	}
	_, err = fmt.Printf("create user route")
	if err != nil {
		log.Fatal(err)
	}
}
