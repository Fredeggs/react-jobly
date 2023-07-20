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

  const userIds = await db.query(
    `
        INSERT INTO users(id, password, first_name, last_name, phone, email, is_admin)
        VALUES (1, $1, 'User1First', 'User1Last', '123-456-7890', 'testuser1@test.com', FALSE),
               (2, $2, 'AdminFirst', 'AdminLast', '123-456-7890', 'testadmin@test.com', TRUE),
               (3, $3, 'User2First', 'User2Last', '123-456-7890', 'testuser2@test.com', FALSE),
               (4, $4, 'User3First', 'User3Last', '123-456-7890', 'testuser3@test.com', FALSE)
        RETURNING id`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password3", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password4", BCRYPT_WORK_FACTOR),
    ]
  );

  const primaryAddressIds = await db.query(`
  INSERT INTO primary_addresses (street, barangay, city, province_id, region_id)
  VALUES ('street1', 'barangay1', 'city1', 49, 1),
        ('street2', 'barangay2', 'city2', 49, 1),
        ('street3', 'barangay3', 'city3', 49, 1),
        ('street4', 'barangay4', 'city4', 49, 1)
  RETURNING id`);

  const resultsLibraries = await db.query(`
    INSERT INTO libraries(admin_id, lib_name, lib_type, program, classrooms, teachers, students_per_grade, primary_address_id)
    VALUES (${userIds.rows[0].id}, 'Elementary School Library 1', 'elementary school', 'FSER', 3, 3, 20, ${primaryAddressIds.rows[0].id}),
           (${userIds.rows[1].id}, 'Community Library 1', 'community', 'LC', null, null, null, ${primaryAddressIds.rows[1].id}),
           (${userIds.rows[2].id}, 'Day Care Library 1', 'day care', 'FSER', 3, 3, 20, ${primaryAddressIds.rows[2].id})
    RETURNING id`);
  testLibraryIds.splice(0, 0, ...resultsLibraries.rows.map((r) => r.id));

  await db.query(`
  INSERT INTO contacts (id, first_name, last_name, phone, email, library_id, contact_type)
  VALUES (1,
          'USContact1-First',
          'USContact1-Last',
          '123-456-7890',
          'ustestcontact1@test.com',
          ${testLibraryIds[0]},
          'us-sponsor'),
          (2,
            'PHContact1-First',
            'PHContact1-Last',
            '123-456-7890',
            'phtestcontact1@test.com',
            ${testLibraryIds[0]},
            'ph-sponsor'),
         (3,
          'USContact2-First',
          'USContact2-Last',
          '123-456-7890',
          'ustestcontact2@test.com',
          ${testLibraryIds[1]},
          'us-sponsor'),
          (4,
            'PHContact2-First',
            'PHContact2-Last',
            '123-456-7890',
            'phtestcontact2@test.com',
            ${testLibraryIds[1]},
            'ph-sponsor')`);

  await db.query(`
  INSERT INTO moas (id, moa_status, library_id)
  VALUES (1,
          'submitted',
          ${testLibraryIds[0]}),
         (2,
          'approved',
          ${testLibraryIds[1]})`);

  await db.query(`
  INSERT INTO reading_spaces (reading_space, library_id)
  VALUES ('reading corner',
          ${testLibraryIds[0]}),
         ('dedicated reading room',
          ${testLibraryIds[0]}),
         ('reading corner',
          ${testLibraryIds[1]})
          `);

  await db.query(`
  INSERT INTO shipments (id, export_declaration, invoice_num, boxes, date_packed, receipt_date, library_id)
  VALUES (1,
          123,
          321,
          2,
          '08-Jan-2022',
          '13-Jan-2022',
          ${testLibraryIds[0]}),
          (2,
          456,
          654,
          1,
          '23-Mar-2022',
          null,
          ${testLibraryIds[1]}),
          (3,
          789,
          987,
          4,
          '14-Mar-2022',
          '25-Mar-2022',
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
