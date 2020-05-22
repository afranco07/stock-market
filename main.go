package main

import (
	"database/sql"
	"fmt"
	"github.com/afranco07/stock-market/routes"
	_ "github.com/lib/pq"
	"log"
	"net/http"
	"os"
)

const driverName = "postgres"

func main() {
	username := os.Getenv("DB_USERNAME")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	if username == "" || password == "" || dbname == "" {
		log.Fatal("database name, username, or password not provided")
	}
	dataSource := fmt.Sprintf("user=%s password=%s dbname=%s sslmode=disable", username, password, dbname)
	db, err := sql.Open(driverName, dataSource)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	app := routes.App{DB: db}

	http.HandleFunc("/createuser", app.CreateUser)

	log.Fatal(http.ListenAndServe(":8080", nil))
}
