# Stock Market App

**NOTE:** I use the [Alpha Vangtage API](https://www.alphavantage.co/documentation/) to get all the stock data. 
Because I am using the free version of their API I am limited to 5 requests/min
 and 500 request/day ([info here](https://www.alphavantage.co/support/#support)).
Because of this the application may result in weird/unexpected behavior. If this happens, wait a few minutes
and try again

### Requirements
* Golang >= 1.12
* React >= v16.8
* Postgres
* Docker (if you want to install Postgres in a container instead)

### Installing/Running Locally
* Install `psql` and create the needed tables in [init.sql](init.sql). Alternatively, you can use docker to start up
the database. Build the image using:
```bash
$ docker build -t stock-market .
```
Then running it:
```bash
$ docker container run --rm -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 stock-market
```
* Install the frontend dependencies and build the pages
```bash
$ npm install --prefix frontend && npm run build --prefix frontend
```
*  Set up the environment variables:
    * `DB_USERNAME` - database username
    * `DB_PASSWORD` - database password
    * `DB_NAME` - database name
    * `PORT` - database port
    * `TOKEN_SIG` - string to sign jwt tokens
    *  `API_KEY` - [Alpha Vantage API Key](https://www.alphavantage.co/support/#api-key)

* Start the server and backend
```bash
$ go run .
```
* Open your browser at `localhost:$PORT`
