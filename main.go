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
	port := os.Getenv("PORT")
	dataURL := os.Getenv("DATABASE_URL")
	if username == "" || password == "" || dbname == "" {
		log.Fatal("database name, username, or password not provided")
	}
	var dataSource string
	if dataURL != "" {
		dataSource = dataURL
	} else {
		dataSource = fmt.Sprintf("user=%s password=%s dbname=%s sslmode=disable", username, password, dbname)
	}
	db, err := sql.Open(driverName, dataSource)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	app := routes.App{DB: db}

	// api routes
	http.HandleFunc("/api/createuser", app.CreateUser)
	http.HandleFunc("/api/login", app.LoginUser)
	http.HandleFunc("/api/auth", app.CheckAuth)

	http.Handle("/api/buy", app.Authenticate(http.HandlerFunc(app.PurchaseSymbol)))
	http.Handle("/api/list", app.Authenticate(http.HandlerFunc(app.ListStocks)))
	http.Handle("/api/transactions", app.Authenticate(http.HandlerFunc(app.ListTransactions)))
	http.Handle("/api/cash", app.Authenticate(http.HandlerFunc(app.GetCash)))
	http.Handle("/api/portfolio", app.Authenticate(http.HandlerFunc(app.GetPortfolioPerformance)))

	// client side routes
	http.Handle("/", http.FileServer(http.Dir("frontend/build")))
	http.HandleFunc("/portfolio", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "frontend/build/index.html")
	})
	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "frontend/build/index.html")
	})
	http.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "frontend/build/index.html")
	})
	http.HandleFunc("/transactions", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "frontend/build/index.html")
	})

	log.Fatal(http.ListenAndServe(":"+port, nil))
}
