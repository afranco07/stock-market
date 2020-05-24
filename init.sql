-- CREATE DATABASE market;

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

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    account uuid references account(id),
    action varchar(4),
    symbol varchar(6),
    amount int,
    price float
);