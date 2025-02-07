-- This file is only my notes, changing
-- this file doesn't change anything in
-- the database
-- Create animals table
CREATE TABLE animals (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name varchar(30) NOT NULL,
  type varchar(30) NOT NULL,
  accessory varchar(30),
  birth_date date NOT NULL
);

-- Inserting into animals table (C from CRUD)
INSERT INTO
  animals (
    first_name,
    type,
    accessory,
    birth_date
  )
VALUES
  (
    'hehehhee',
    'Cat',
    'House',
    '1999-06-23'
  ),
  (
    'hehhehehek',
    'Capybaras',
    'Car',
    '2020-06-23'
  ),
  (
    'Jojo',
    'Dog',
    'Bike',
    '2020-06-23'
  ),
  (
    'Macca',
    'Elephant',
    'Key',
    '2020-06-23'
  ),
  (
    'Fro',
    'Duck',
    'Motor',
    '2020-06-23'
  );

-- Select all animals(R from CRUD)
SELECT
  *
FROM
  animals;

-- Database setup
CREATE DATABASE next_js_example_2025;

CREATE USER next_js_example_2025
WITH
  encrypted password 'next_js_example_2025';

GRANT ALL privileges ON database next_js_example_2025 TO next_js_example_2025;

-- \connect next_js_example_2025
CREATE SCHEMA next_js_example_2025 AUTHORIZATION next_js_example_2025;
