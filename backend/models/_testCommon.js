const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

let testLibraryIds = [];

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM contacts");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM libraries");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM primary_addresses");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM shipping_addresses");

  const userIds = await db.query(
    `
        INSERT INTO users(id, password, first_name, last_name, phone, email, is_admin)
        VALUES (1, $1, 'User1First', 'User1Last', '123-456-7890', 'testuser1@test.com', FALSE),
               (2, $2, 'AdminFirst', 'AdminLast', '123-456-7890', 'testadmin@test.com', TRUE),
               (3, $3, 'User2First', 'User2Last', '123-456-7890', 'testuser2@test.com', FALSE)
        RETURNING id`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password3", BCRYPT_WORK_FACTOR),
    ]
  );

  const primaryAddressIds = await db.query(`
  INSERT INTO primary_addresses (street, barangay, city, province_id, region_id)
  VALUES ('street1', 'barangay1', 'city1', 49, 1),
        ('street2', 'barangay2', 'city2', 49, 1),
        ('street3', 'barangay3', 'city3', 49, 1),
        ('street4', 'barangay4', 'city4', 49, 1)
  RETURNING id`);

  const shippingAddressIds = await db.query(`
  INSERT INTO shipping_addresses (street, barangay, city, province_id, region_id)
  VALUES ('street1', 'barangay1', 'city1', 49, 1),
        ('street2', 'barangay2', 'city2', 49, 1),
        ('street3', 'barangay3', 'city3', 49, 1),
        ('street4', 'barangay4', 'city4', 49, 1)
  RETURNING id`);

  const resultsLibraries = await db.query(`
    INSERT INTO libraries(admin_id, lib_name, lib_type, program, classrooms, teachers, students_per_grade, primary_address_id, shipping_address_id)
    VALUES (${userIds.rows[0].id}, 'Elementary School Library 1', 'elementary school', 'FSER', 3, 3, 20, ${primaryAddressIds.rows[0].id}, ${shippingAddressIds.rows[0].id}),
           (${userIds.rows[1].id}, 'Community Library 1', 'community', 'LC', null, null, null, ${primaryAddressIds.rows[1].id}, ${shippingAddressIds.rows[1].id})
    RETURNING id`);
  testLibraryIds.splice(0, 0, ...resultsLibraries.rows.map((r) => r.id));

  await db.query(`
  INSERT INTO contacts (id, first_name, last_name, phone, email, library_id)
  VALUES (1,
          'Contact1-First',
          'Contact1-Last',
          '123-456-7890',
          'testcontact1@test.com',
          ${testLibraryIds[0]}),
         (2,
          'Contact2-First',
          'Contact1-Last',
          '123-456-7890',
          'testcontact2@test.com',
          ${testLibraryIds[1]})`);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testLibraryIds,
};
