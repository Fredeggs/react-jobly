CREATE TYPE library_type AS ENUM ('elementary school', 'day care', 'high school', 'community');
CREATE TYPE moa_statuses AS ENUM ('approved', 'rejected', 'submitted');
CREATE TYPE contact_types AS ENUM ('ph-sponsor', 'us-sponsor');
CREATE TYPE reading_space_names AS ENUM ('reading corner', 'dedicated reading room');

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

CREATE TABLE libraries (
  id SERIAL PRIMARY KEY,
  lib_name TEXT UNIQUE NOT NULL,
  admin_id INTEGER REFERENCES users ON DELETE CASCADE,
  lib_type library_type,
  program TEXT,
  classrooms INTEGER CHECK (classrooms >= 0),
  teachers INTEGER CHECK (teachers >= 0),
  students_per_grade INTEGER CHECK (students_per_grade >= 0),
  total_residents INTEGER CHECK (total_residents >= 0),
  elem_visitors INTEGER CHECK (elem_visitors >= 0),
  high_school_visitors INTEGER CHECK (high_school_visitors >= 0),
  college_visitors INTEGER CHECK (college_visitors >= 0),
  adult_visitors INTEGER CHECK (adult_visitors >= 0),
  primary_address_id INTEGER REFERENCES primary_addresses
);

CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  contact_type contact_types NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  library_id INTEGER REFERENCES libraries ON DELETE CASCADE
);

CREATE TABLE moas (
  id SERIAL PRIMARY KEY,
  moa_status moa_statuses,
  library_id INTEGER REFERENCES libraries ON DELETE CASCADE
);

CREATE TABLE shipments (
  id SERIAL PRIMARY KEY,
  export_declaration INTEGER CHECK (export_declaration >= 0) UNIQUE NOT NULL,
  invoice_num INTEGER CHECK (invoice_num >= 0) NOT NULL,
  boxes INTEGER CHECK (boxes >= 0) NOT NULL,
  date_packed DATE NOT NULL,
  receipt_date DATE DEFAULT NULL,
  library_id INTEGER REFERENCES libraries ON DELETE CASCADE
);


CREATE TABLE reading_spaces (
  id SERIAL PRIMARY KEY,
  library_id INTEGER REFERENCES libraries ON DELETE CASCADE,
  reading_space reading_space_names
);