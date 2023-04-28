CREATE TYPE library_type AS ENUM ('elementary school', 'middle school', 'high school', 'community');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1) UNIQUE,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE provinces (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE regions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE primary_addresses (
  id SERIAL PRIMARY KEY,
  street TEXT NOT NULL,
  barangay TEXT NOT NULL,
  city TEXT NOT NULL,
  province_id INTEGER REFERENCES provinces,
  region_id INTEGER REFERENCES regions
);

CREATE TABLE shipping_addresses (
  id SERIAL PRIMARY KEY,
  street TEXT NOT NULL,
  barangay TEXT NOT NULL,
  city TEXT NOT NULL,
  province_id INTEGER REFERENCES provinces,
  region_id INTEGER REFERENCES regions
);

CREATE TABLE libraries (
  id SERIAL PRIMARY KEY,
  lib_name TEXT UNIQUE NOT NULL,
  admin_id INTEGER REFERENCES users,
  lib_type library_type,
  program TEXT NOT NULL,
  classrooms INTEGER CHECK (classrooms >= 0),
  teachers INTEGER CHECK (teachers >= 0),
  students_per_grade INTEGER CHECK (students_per_grade >= 0),
  primary_address_id INTEGER REFERENCES primary_addresses,
  shipping_address_id INTEGER REFERENCES shipping_addresses
);

CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  library_id INTEGER REFERENCES libraries ON DELETE CASCADE
);

