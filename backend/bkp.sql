\echo 'Delete and recreate bkp db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE bkp;
CREATE DATABASE bkp;
\connect bkp

\i bkp-schema.sql
\i bkp-seed.sql

\echo 'Delete and recreate bkp_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE bkp_test;
CREATE DATABASE bkp_test;
\connect bkp_test

\i bkp-schema.sql
\i bkp-test-seed.sql
