package routes

import "database/sql"

// App is the database connections and
// associated route functions
type App struct {
	DB *sql.DB
}
