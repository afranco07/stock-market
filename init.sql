-- CREATE DATABASE market;
-- CREATE USER docker;
-- GRANT ALL PRIVILEGES ON DATABASE market TO docker;

CREATE TABLE account (
    id uuid PRIMARY KEY,
    email varchar(250),
    password varchar(250),
    cash float
);

CREATE TABLE stocks (
    id uuid PRIMARY KEY,
    account uuid REFERENCES account(id),
    symbol varchar(6),
    price float,
    amount int
);