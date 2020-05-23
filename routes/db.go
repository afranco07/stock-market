package routes

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

var (
	apiKey = os.Getenv("API_KEY")
)

const (
	baseURL         = "https://www.alphavantage.co"
	defaultInterval = "5min"
	apiLink         = "%s/query?function=%s&symbol=%s&interval=%s&apikey=%s"
)

type apiFunction string

const (
	//functionIntraDay    apiFunction = "TIME_SERIES_INTRADAY"
	//functionSeriesDaily apiFunction = "TIME_SERIES_DAILY"
	functionQuote apiFunction = "GLOBAL_QUOTE"
)

type quoteResponse struct {
	GlobalQuote globalQuote `json:"Global Quote"`
}
type globalQuote struct {
	Symbol           string  `json:"01. symbol"`
	Open             float32 `json:"02. open,string"`
	High             float32 `json:"03. high,string"`
	Low              float32 `json:"04. low,string"`
	Price            float32 `json:"05. price,string"`
	Volume           int32   `json:"06. volume,string"`
	LatestTradingDay string  `json:"07. latest trading day"`
	PreviousClose    float32 `json:"08. previous close,string"`
	Change           float32 `json:"09. change,string"`
	ChangePercent    string  `json:"10. change percent"`
}

// App is the database connections and
// associated route functions
type App struct {
	DB *sql.DB
}

func apiCallGlobalQuote(symbol string) (globalQuote, error) {
	var quote quoteResponse

	url := fmt.Sprintf(apiLink, baseURL, functionQuote, symbol, defaultInterval, apiKey)
	resp, err := http.Get(url)
	if err != nil {
		return quote.GlobalQuote, err
	}
	defer resp.Body.Close()

	err = json.NewDecoder(resp.Body).Decode(&quote)
	if err != nil {
		return quote.GlobalQuote, err
	}

	return quote.GlobalQuote, nil
}
