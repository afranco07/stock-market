-- CREATE DATABASE market;
-- CREATE USER docker;
-- GRANT ALL PRIVILEGES ON DATABASE market TO docker;
-- \c market;

CREATE TABLE account (
    id uuid PRIMARY KEY,
    email varchar(250),
    password varchar(250),
    cash float
);