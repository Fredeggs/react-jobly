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
    libraryData: {
      libraryName: "New Library",
      libraryType: "middle school",
      classrooms: 1,
      studentsPerGrade: 2,
      teachers: 3,
      program: "FSER",
    },
    contactData: {
      firstName: "First",
      lastName: "Last",
      phone: "0000000000",
      email: "contact@gmail.com",
    },
    primaryAddress: {
      street: "Primary Street",
      barangay: "Primary Barangay",
      city: "Primary City",
      provinceId: 1,
      regionId: 1,
    },
    shippingAddress: {
      street: "Primary Street",
      barangay: "Primary Barangay",
      city: "Primary City",
      provinceId: 1,
      regionId: 1,
    },
    adminId: 4,
  };

  test("works", async function () {
    let library = await Library.createLibrary(newLibrary);
    expect(library).toEqual({
      ...newLibrary,
      id: expect.any(Number),
      contactData: {
        ...newLibrary.contactData,
        id: expect.any(Number),
        libraryId: expect.any(Number),
      },
      primaryAddress: {
        ...newLibrary.primaryAddress,
        id: expect.any(Number),
      },
      shippingAddress: {
        ...newLibrary.shippingAddress,
        id: expect.any(Number),
      },
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
      firstName: "Test",
      lastName: "Contact",
      email: "testcontact@gmail.com",
      phone: "111-111-1111",
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
      firstName: "Test",
      lastName: "Contact",
      email: "testcontact@gmail.com",
      phone: "111-111-1111",
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

/************************************** createMOA */

describe("create moa", function () {
  test("works", async function () {
    const newMOA = {
      link: "link to s3 bucket",
      libraryId: testLibraryIds[2],
    };
    let moa = await Library.createMOA(newMOA);

    expect(moa).toEqual({
      ...newMOA,
      moaStatus: "submitted",
      id: expect.any(Number),
    });
  });

  test("bad request with dupe", async function () {
    const newMOA = {
      link: "link to s3 bucket",
      libraryId: testLibraryIds[2],
    };

    try {
      await Library.createMOA(newMOA);
      await Library.createMOA(newMOA);
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
      {
        id: expect.any(Number),
        adminId: expect.any(Number),
        libraryName: "Middle School Library 1",
        libraryType: "middle school",
        primaryBarangay: "barangay3",
        primaryCity: "city3",
        primaryProvince: "Metro Manila",
        primaryRegion: "Luzon",
        primaryStreet: "street3",
        shippingBarangay: "barangay3",
        shippingCity: "city3",
        shippingProvince: "Metro Manila",
        shippingRegion: "Luzon",
        shippingStreet: "street3",
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
      libraryData: {
        classrooms: 3,
        libraryName: "Elementary School Library 1",
        libraryType: "elementary school",
        program: "FSER",
        studentsPerGrade: 20,
        teachers: 3,
      },
      admin: {
        id: expect.any(Number),
        email: "testuser1@test.com",
        firstName: "User1First",
        lastName: "User1Last",
        phone: "123-456-7890",
      },
      contactData: {
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
      moa: {
        id: expect.any(Number),
        link: "link number 1",
        moaStatus: "submitted",
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
  const updateData1 = {
    libraryData: {
      libraryName: "Updated Name",
    },
    primaryAddress: {},
    shippingAddress: {},
    contactData: { firstName: "Updated First Name" },
  };

  const updateData2 = {
    libraryData: {},
    primaryAddress: {
      regionId: 3,
      provinceId: 10,
    },
    shippingAddress: {
      regionId: 3,
      provinceId: 10,
    },
    contactData: {},
  };

  test("works: updating libraryData and contactData", async function () {
    let library = await Library.update(testLibraryIds[0], updateData1);
    expect(library).toEqual({
      libraryData: {
        classrooms: 3,
        libraryName: "Updated Name",
        libraryType: "elementary school",
        program: "FSER",
        studentsPerGrade: 20,
        teachers: 3,
      },
      primaryAddress: {
        barangay: "barangay1",
        city: "city1",
        province: "Metro Manila",
        region: "Luzon",
        street: "street1",
      },
      shippingAddress: {
        barangay: "barangay1",
        city: "city1",
        province: "Metro Manila",
        region: "Luzon",
        street: "street1",
      },
      contactData: {
        email: "testcontact1@test.com",
        firstName: "Updated First Name",
        lastName: "Contact1-Last",
        phone: "123-456-7890",
      },
    });

    const getLibrary = await Library.get(testLibraryIds[0]);
    expect(getLibrary).toEqual({
      id: expect.any(Number),
      libraryData: {
        classrooms: 3,
        libraryName: "Updated Name",
        libraryType: "elementary school",
        studentsPerGrade: 20,
        teachers: 3,
        program: "FSER",
      },
      admin: {
        email: "testuser1@test.com",
        firstName: "User1First",
        id: expect.any(Number),
        lastName: "User1Last",
        phone: "123-456-7890",
      },
      contactData: {
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
      moa: {
        id: expect.any(Number),
        link: "link number 1",
        moaStatus: "submitted",
      },
    });
  });

  test("works: updating primaryAddress and shippingAddress", async function () {
    let library = await Library.update(testLibraryIds[0], updateData2);
    expect(library).toEqual({
      libraryData: {
        classrooms: 3,
        libraryName: "Elementary School Library 1",
        libraryType: "elementary school",
        program: "FSER",
        studentsPerGrade: 20,
        teachers: 3,
      },
      primaryAddress: {
        barangay: "barangay1",
        city: "city1",
        province: "Batanes",
        region: "Mindanao",
        street: "street1",
      },
      shippingAddress: {
        barangay: "barangay1",
        city: "city1",
        province: "Batanes",
        region: "Mindanao",
        street: "street1",
      },
      contactData: {
        email: "testcontact1@test.com",
        firstName: "Contact1-First",
        lastName: "Contact1-Last",
        phone: "123-456-7890",
      },
    });

    const getLibrary = await Library.get(testLibraryIds[0]);
    expect(getLibrary).toEqual({
      id: expect.any(Number),
      libraryData: {
        classrooms: 3,
        libraryName: "Elementary School Library 1",
        libraryType: "elementary school",
        studentsPerGrade: 20,
        teachers: 3,
        program: "FSER",
      },
      admin: {
        email: "testuser1@test.com",
        firstName: "User1First",
        id: expect.any(Number),
        lastName: "User1Last",
        phone: "123-456-7890",
      },
      contactData: {
        email: "testcontact1@test.com",
        firstName: "Contact1-First",
        id: expect.any(Number),
        lastName: "Contact1-Last",
        phone: "123-456-7890",
      },
      primaryAddress: {
        barangay: "barangay1",
        city: "city1",
        id: expect.any(Number),
        province: "Batanes",
        region: "Mindanao",
        street: "street1",
      },
      shippingAddress: {
        barangay: "barangay1",
        city: "city1",
        id: expect.any(Number),
        province: "Batanes",
        region: "Mindanao",
        street: "street1",
      },
      moa: {
        id: expect.any(Number),
        link: "link number 1",
        moaStatus: "submitted",
      },
    });
  });

  test("not found if no such library", async function () {
    try {
      await Library.update(0, updateData1);
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
