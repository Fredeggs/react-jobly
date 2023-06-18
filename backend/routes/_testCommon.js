"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Library = require("../models/library");
const MOA = require("../models/moa");
const Shipment = require("../models/shipment");
const { createToken } = require("../helpers/tokens");
const { token } = require("morgan");

let testUserIds = [];
let testLibraryIds = [];
let tokens = {};

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

  const u1 = await User.register({
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    phone: "1111111111",
    password: "password1",
    isAdmin: false,
  });
  testUserIds.push(u1.id);

  const u2 = await User.register({
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    phone: "2222222222",
    password: "password2",
    isAdmin: false,
  });
  testUserIds.push(u2.id);

  const u3 = await User.register({
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    phone: "3333333333",
    password: "password3",
    isAdmin: true,
  });
  testUserIds.push(u3.id);

  const u4 = await User.register({
    firstName: "U4F",
    lastName: "U4L",
    email: "user4@user.com",
    phone: "4444444444",
    password: "password4",
    isAdmin: false,
  });
  testUserIds.push(u4.id);

  const u5 = await User.register({
    firstName: "U5F",
    lastName: "U5L",
    email: "user5@user.com",
    phone: "5555555555",
    password: "password5",
    isAdmin: false,
  });
  testUserIds.push(u5.id);

  const l1 = await Library.createLibrary({
    libraryData: {
      libraryName: "Middle School Library",
      libraryType: "middle school",
      classrooms: 1,
      studentsPerGrade: 10,
      teachers: 3,
      program: "FSER",
    },
    contactData: {
      firstName: "First",
      lastName: "Last",
      phone: "000-000-0000",
      email: "contact1@gmail.com",
    },
    primaryAddress: {
      street: "Primary Street",
      barangay: "Primary Barangay",
      city: "Primary City",
      provinceId: 1,
      regionId: 1,
    },
    shippingAddress: {
      street: "Shipping Street",
      barangay: "Shipping Barangay",
      city: "Shipping City",
      provinceId: 1,
      regionId: 1,
    },
    adminId: testUserIds[0],
  });
  testLibraryIds.push(l1.id);

  const l2 = await Library.createLibrary({
    libraryData: {
      libraryName: "Elementary School Library",
      libraryType: "elementary school",
      classrooms: 1,
      studentsPerGrade: 20,
      teachers: 3,
      program: "FSER",
    },
    contactData: {
      firstName: "First",
      lastName: "Last",
      phone: "000-000-0000",
      email: "contact2@gmail.com",
    },
    primaryAddress: {
      street: "Primary Street",
      barangay: "Primary Barangay",
      city: "Primary City",
      provinceId: 2,
      regionId: 2,
    },
    shippingAddress: {
      street: "Shipping Street",
      barangay: "Shipping Barangay",
      city: "Shipping City",
      provinceId: 2,
      regionId: 2,
    },
    adminId: testUserIds[1],
  });
  testLibraryIds.push(l2.id);

  const l3 = await Library.createLibrary({
    libraryData: {
      libraryName: "Community Library",
      libraryType: "community",
      classrooms: null,
      studentsPerGrade: null,
      teachers: null,
      program: "FSER",
    },
    contactData: {
      firstName: "First",
      lastName: "Last",
      phone: "000-000-0000",
      email: "contact3@gmail.com",
    },
    primaryAddress: {
      street: "Primary Street",
      barangay: "Primary Barangay",
      city: "Primary City",
      provinceId: 3,
      regionId: 3,
    },
    shippingAddress: {
      street: "Shipping Street",
      barangay: "Shipping Barangay",
      city: "Shipping City",
      provinceId: 3,
      regionId: 3,
    },
    adminId: testUserIds[2],
  });
  testLibraryIds.push(l3.id);

  const l4 = await Library.createLibrary({
    libraryData: {
      libraryName: "Community Library 2",
      libraryType: "community",
      classrooms: null,
      studentsPerGrade: null,
      teachers: null,
      program: "FSER",
    },
    contactData: {
      firstName: "First",
      lastName: "Last",
      phone: "000-000-0000",
      email: "contact4@gmail.com",
    },
    primaryAddress: {
      street: "Primary Street",
      barangay: "Primary Barangay",
      city: "Primary City",
      provinceId: 3,
      regionId: 3,
    },
    shippingAddress: {
      street: "Shipping Street",
      barangay: "Shipping Barangay",
      city: "Shipping City",
      provinceId: 3,
      regionId: 3,
    },
    adminId: testUserIds[3],
  });
  testLibraryIds.push(l4.id);

  await MOA.create(testLibraryIds[0]);
  await MOA.create(testLibraryIds[1]);

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

  tokens.u1Token = createToken({
    id: testUserIds[0],
    email: "user1@user.com",
    libraryId: testLibraryIds[0],
    shipments: [1],
    isAdmin: false,
  });
  tokens.u2Token = createToken({
    id: testUserIds[1],
    email: "user2@user.com",
    libraryId: testLibraryIds[1],
    shipments: [2, 3],
    isAdmin: false,
  });
  tokens.adminToken = createToken({
    id: testUserIds[2],
    email: "user3@user.com",
    libraryId: testLibraryIds[2],
    shipments: [],
    isAdmin: true,
  });
  tokens.u3Token = createToken({
    id: testUserIds[3],
    email: "user4@user.com",
    libraryId: testLibraryIds[3],
    shipments: [],
    isAdmin: false,
  });
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
  testUserIds,
  testLibraryIds,
  tokens,
};
