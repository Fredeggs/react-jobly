"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError.js");
const Library = require("./library.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testLibraryIds,
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** createLibrary */

describe("create library", function () {
  const newLibrary = {
    libraryName: "New Library",
    adminId: 1,
    libraryType: "middle school",
    primaryStreet: "Primary Street",
    primaryBarangay: "Primary Barangay",
    primaryCity: "Primary City",
    primaryProvinceId: 1,
    primaryRegionId: 1,
    shippingStreet: "Shipping Street",
    shippingBarangay: "Shipping Barangay",
    shippingCity: "Shipping City",
    shippingProvinceId: 1,
    shippingRegionId: 1,
    classrooms: 1,
    studentsPerGrade: 2,
    teachers: 3,
    program: "FSER",
    contactFirst: "First",
    contactLast: "Last",
    contactPhone: "000-000-0000",
    contactEmail: "contact@gmail.com",
  };

  test("works", async function () {
    let library = await Library.createLibrary(newLibrary);
    expect(library).toEqual({
      ...newLibrary,
      id: expect.any(Number),
      libraryId: expect.any(Number),
    });
  });

  test("bad request with dupe", async function () {
    try {
      await Library.createLibrary(newLibrary);
      await Library.createLibrary(newLibrary);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** createContact */

describe("create contact", function () {
  test("works", async function () {
    const newContact = {
      contactFirst: "Test",
      contactLast: "Contact",
      contactEmail: "testcontact@gmail.com",
      contactPhone: "111-111-1111",
      libraryId: testLibraryIds[0],
    };
    let contact = await Library.createContact(newContact);

    expect(contact).toEqual({
      ...newContact,
      id: expect.any(Number),
    });
  });

  test("bad request with dupe", async function () {
    const newContact = {
      contactFirst: "Test",
      contactLast: "Contact",
      contactEmail: "testcontact@gmail.com",
      contactPhone: "111-111-1111",
      libraryId: testLibraryIds[0],
    };

    try {
      await Library.createContact(newContact);
      await Library.createContact(newContact);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: all", async function () {
    let libraries = await Library.findAll();
    expect(libraries).toEqual([
      {
        id: expect.any(Number),
        adminId: expect.any(Number),
        libraryName: "Community Library 1",
        libraryType: "community",
        primaryBarangay: "barangay2",
        primaryCity: "city2",
        primaryProvince: "Metro Manila",
        primaryRegion: "Luzon",
        primaryStreet: "street2",
        shippingBarangay: "barangay2",
        shippingCity: "city2",
        shippingProvince: "Metro Manila",
        shippingRegion: "Luzon",
        shippingStreet: "street2",
      },
      {
        id: expect.any(Number),
        adminId: expect.any(Number),
        libraryName: "Elementary School Library 1",
        libraryType: "elementary school",
        primaryBarangay: "barangay1",
        primaryCity: "city1",
        primaryProvince: "Metro Manila",
        primaryRegion: "Luzon",
        primaryStreet: "street1",
        shippingBarangay: "barangay1",
        shippingCity: "city1",
        shippingProvince: "Metro Manila",
        shippingRegion: "Luzon",
        shippingStreet: "street1",
      },
    ]);
  });

  test("works: by name", async function () {
    let libraries = await Library.findAll({ name: "community" });
    expect(libraries).toEqual([
      {
        id: expect.any(Number),
        adminId: expect.any(Number),
        libraryName: "Community Library 1",
        libraryType: "community",
        primaryBarangay: "barangay2",
        primaryCity: "city2",
        primaryProvince: "Metro Manila",
        primaryRegion: "Luzon",
        primaryStreet: "street2",
        shippingBarangay: "barangay2",
        shippingCity: "city2",
        shippingProvince: "Metro Manila",
        shippingRegion: "Luzon",
        shippingStreet: "street2",
      },
    ]);
  });

  test("works: empty list on nothing found", async function () {
    let libraries = await Library.findAll({ name: "nope" });
    expect(libraries).toEqual([]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let library = await Library.get(testLibraryIds[0]);
    expect(library).toEqual({
      id: expect.any(Number),
      libraryDetails: {
        classrooms: 3,
        libraryName: "Elementary School Library 1",
        libraryType: "elementary school",
        readingProgram: "FSER",
        studentsPerGrade: 20,
        teachers: 3,
      },
      admin: {
        id: expect.any(Number),
        email: "testuser@test.com",
        firstName: "Test",
        lastName: "User",
        phone: "123-456-7890",
      },
      contact: {
        id: expect.any(Number),
        email: "testcontact1@test.com",
        firstName: "Contact1-First",
        lastName: "Contact1-Last",
        phone: "123-456-7890",
      },
      primaryAddress: {
        id: expect.any(Number),
        barangay: "barangay1",
        city: "city1",
        province: "Metro Manila",
        region: "Luzon",
        street: "street1",
      },
      shippingAddress: {
        id: expect.any(Number),
        barangay: "barangay1",
        city: "city1",
        province: "Metro Manila",
        region: "Luzon",
        street: "street1",
      },
    });
  });

  test("not found if no such library", async function () {
    try {
      await Library.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    libraryDetails: {
      libraryName: "Updated Name",
    },
    primaryAddress: {},
    shippingAddress: {},
    contact: { firstName: "Updated First Name" },
  };

  test("works", async function () {
    let library = await Library.update(testLibraryIds[0], updateData);
    expect(library).toEqual({
      libraryDetails: {
        classrooms: 3,
        libraryName: "Updated Name",
        libraryType: "elementary school",
        readingProgram: "FSER",
        studentsPerGrade: 20,
        teachers: 3,
      },
      primaryAddress: {},
      shippingAddress: {},
      contact: {
        email: "testcontact1@test.com",
        firstName: "Updated First Name",
        lastName: "Contact1-Last",
        phone: "123-456-7890",
      },
    });

    const getLibrary = await Library.get(testLibraryIds[0]);
    expect(getLibrary).toEqual({
      id: expect.any(Number),
      libraryDetails: {
        classrooms: 3,
        libraryName: "Updated Name",
        libraryType: "elementary school",
        studentsPerGrade: 20,
        teachers: 3,
        readingProgram: "FSER",
      },
      admin: {
        email: "testuser@test.com",
        firstName: "Test",
        id: expect.any(Number),
        lastName: "User",
        phone: "123-456-7890",
      },
      contact: {
        email: "testcontact1@test.com",
        firstName: "Updated First Name",
        id: expect.any(Number),
        lastName: "Contact1-Last",
        phone: "123-456-7890",
      },
      primaryAddress: {
        barangay: "barangay1",
        city: "city1",
        id: expect.any(Number),
        province: "Metro Manila",
        region: "Luzon",
        street: "street1",
      },
      shippingAddress: {
        barangay: "barangay1",
        city: "city1",
        id: expect.any(Number),
        province: "Metro Manila",
        region: "Luzon",
        street: "street1",
      },
    });
  });

  test("not found if no such company", async function () {
    try {
      await Library.update(0, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Library.update(testLibraryIds[0], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Library.remove(testLibraryIds[0]);
    const res = await db.query(
      `SELECT id FROM libraries WHERE id=${testLibraryIds[0]}`
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such library", async function () {
    try {
      await Library.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
