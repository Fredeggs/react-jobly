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
      libraryType: "elementary school",
      classrooms: 1,
      studentsPerGrade: 2,
      teachers: 3,
      program: "FSER",
      totalResidents: 0,
      elementaryVisitors: 0,
      highSchoolVisitors: 0,
      collegeVisitors: 0,
      adultVisitors: 0,
    },
    USContact: {
      firstName: "First",
      lastName: "Last",
      phone: "0000000000",
      email: "uscontact@gmail.com",
    },
    PHContact: {
      firstName: "First",
      lastName: "Last",
      phone: "0000000000",
      email: "phcontact@gmail.com",
    },
    primaryAddress: {
      street: "Primary Street",
      barangay: "Primary Barangay",
      city: "Primary City",
      provinceId: 1,
      regionId: 1,
    },
    readingSpaces: ["reading corner"],
    adminId: 4,
  };

  const newCommunityLibrary = {
    libraryData: {
      libraryName: "New Library",
      libraryType: "community",
      classrooms: 0,
      studentsPerGrade: 0,
      teachers: 0,
      program: "FSER",
      totalResidents: 700,
      elementaryVisitors: 45,
      highSchoolVisitors: 50,
      collegeVisitors: 30,
      adultVisitors: 80,
    },
    USContact: {
      firstName: "First",
      lastName: "Last",
      phone: "0000000000",
      email: "uscontact@gmail.com",
    },
    PHContact: {
      firstName: "First",
      lastName: "Last",
      phone: "0000000000",
      email: "phcontact@gmail.com",
    },
    primaryAddress: {
      street: "Primary Street",
      barangay: "Primary Barangay",
      city: "Primary City",
      provinceId: 1,
      regionId: 1,
    },
    readingSpaces: ["reading corner"],
    adminId: 4,
  };

  test("works: school library", async function () {
    let library = await Library.createLibrary(newLibrary);
    expect(library).toEqual({
      ...newLibrary,
      id: expect.any(Number),
      USContact: {
        ...newLibrary.USContact,
        id: expect.any(Number),
        libraryId: expect.any(Number),
        contactType: "us-sponsor",
      },
      PHContact: {
        ...newLibrary.PHContact,
        id: expect.any(Number),
        libraryId: expect.any(Number),
        contactType: "ph-sponsor",
      },
      primaryAddress: {
        ...newLibrary.primaryAddress,
        id: expect.any(Number),
      },
      readingSpaces: newLibrary.readingSpaces,
    });
  });

  test("works: community library", async function () {
    let library = await Library.createLibrary(newCommunityLibrary);
    expect(library).toEqual({
      ...newCommunityLibrary,
      id: expect.any(Number),
      USContact: {
        ...newCommunityLibrary.USContact,
        id: expect.any(Number),
        libraryId: expect.any(Number),
        contactType: "us-sponsor",
      },
      PHContact: {
        ...newCommunityLibrary.PHContact,
        id: expect.any(Number),
        libraryId: expect.any(Number),
        contactType: "ph-sponsor",
      },
      primaryAddress: {
        ...newCommunityLibrary.primaryAddress,
        id: expect.any(Number),
      },
      readingSpaces: newCommunityLibrary.readingSpaces,
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
      contactType: "us-sponsor",
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
      contactType: "us-sponsor",
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
        moaStatus: "approved",
      },
      {
        id: expect.any(Number),
        adminId: expect.any(Number),
        libraryName: "Day Care Library 1",
        libraryType: "day care",
        primaryBarangay: "barangay3",
        primaryCity: "city3",
        primaryProvince: "Metro Manila",
        primaryRegion: "Luzon",
        primaryStreet: "street3",
        moaStatus: null,
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
        moaStatus: "submitted",
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
        moaStatus: "approved",
      },
    ]);
  });

  test("works: filter by submittedMOA", async function () {
    let libraries = await Library.findAll({ submittedMOA: true });
    expect(libraries).toEqual([
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
        moaStatus: "submitted",
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
        totalResidents: 0,
        elementaryVisitors: 0,
        highSchoolVisitors: 0,
        collegeVisitors: 0,
        adultVisitors: 0,
      },
      admin: {
        id: expect.any(Number),
        email: "testuser1@test.com",
        firstName: "User1First",
        lastName: "User1Last",
        phone: "123-456-7890",
      },
      USContact: {
        id: expect.any(Number),
        email: "ustestcontact1@test.com",
        firstName: "USContact1-First",
        lastName: "USContact1-Last",
        phone: "123-456-7890",
      },
      PHContact: {
        id: expect.any(Number),
        email: "phtestcontact1@test.com",
        firstName: "PHContact1-First",
        lastName: "PHContact1-Last",
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
      readingSpaces: ["reading corner", "dedicated reading room"],
      moa: {
        id: expect.any(Number),
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
    USContact: { firstName: "Updated First Name" },
    PHContact: {},
  };

  const updateData2 = {
    libraryData: {},
    primaryAddress: {
      regionId: 3,
      provinceId: 10,
    },
    USContact: {},
    PHContact: {},
  };

  const updateData3 = {
    libraryData: {},
    primaryAddress: {},
    USContact: {},
    PHContact: {},
    readingSpaces: ["dedicated reading room"],
  };

  test("works: updating libraryData and USContact", async function () {
    let library = await Library.update(testLibraryIds[0], updateData1);
    expect(library).toEqual({
      libraryData: {
        classrooms: 3,
        libraryName: "Updated Name",
        libraryType: "elementary school",
        program: "FSER",
        studentsPerGrade: 20,
        teachers: 3,
        totalResidents: 0,
        elementaryVisitors: 0,
        highSchoolVisitors: 0,
        collegeVisitors: 0,
        adultVisitors: 0,
      },
      primaryAddress: {
        barangay: "barangay1",
        city: "city1",
        province: "Metro Manila",
        region: "Luzon",
        street: "street1",
      },
      USContact: {
        email: "ustestcontact1@test.com",
        firstName: "Updated First Name",
        lastName: "USContact1-Last",
        phone: "123-456-7890",
      },
      PHContact: {
        email: "phtestcontact1@test.com",
        firstName: "PHContact1-First",
        lastName: "PHContact1-Last",
        phone: "123-456-7890",
      },
      readingSpaces: ["reading corner", "dedicated reading room"],
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
        totalResidents: 0,
        elementaryVisitors: 0,
        highSchoolVisitors: 0,
        collegeVisitors: 0,
        adultVisitors: 0,
      },
      admin: {
        email: "testuser1@test.com",
        firstName: "User1First",
        id: expect.any(Number),
        lastName: "User1Last",
        phone: "123-456-7890",
      },
      USContact: {
        email: "ustestcontact1@test.com",
        firstName: "Updated First Name",
        id: expect.any(Number),
        lastName: "USContact1-Last",
        phone: "123-456-7890",
      },
      PHContact: {
        email: "phtestcontact1@test.com",
        firstName: "PHContact1-First",
        id: expect.any(Number),
        lastName: "PHContact1-Last",
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
      readingSpaces: ["reading corner", "dedicated reading room"],
      moa: {
        id: expect.any(Number),
        moaStatus: "submitted",
      },
    });
  });

  test("works: updating primaryAddress", async function () {
    let library = await Library.update(testLibraryIds[0], updateData2);
    expect(library).toEqual({
      libraryData: {
        classrooms: 3,
        libraryName: "Elementary School Library 1",
        libraryType: "elementary school",
        program: "FSER",
        studentsPerGrade: 20,
        teachers: 3,
        totalResidents: 0,
        elementaryVisitors: 0,
        highSchoolVisitors: 0,
        collegeVisitors: 0,
        adultVisitors: 0,
      },
      primaryAddress: {
        barangay: "barangay1",
        city: "city1",
        province: "Batanes",
        region: "Mindanao",
        street: "street1",
      },
      USContact: {
        email: "ustestcontact1@test.com",
        firstName: "USContact1-First",
        lastName: "USContact1-Last",
        phone: "123-456-7890",
      },
      PHContact: {
        email: "phtestcontact1@test.com",
        firstName: "PHContact1-First",
        lastName: "PHContact1-Last",
        phone: "123-456-7890",
      },
      readingSpaces: ["reading corner", "dedicated reading room"],
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
        totalResidents: 0,
        elementaryVisitors: 0,
        highSchoolVisitors: 0,
        collegeVisitors: 0,
        adultVisitors: 0,
      },
      admin: {
        email: "testuser1@test.com",
        firstName: "User1First",
        id: expect.any(Number),
        lastName: "User1Last",
        phone: "123-456-7890",
      },
      USContact: {
        email: "ustestcontact1@test.com",
        firstName: "USContact1-First",
        id: expect.any(Number),
        lastName: "USContact1-Last",
        phone: "123-456-7890",
      },
      PHContact: {
        email: "phtestcontact1@test.com",
        firstName: "PHContact1-First",
        id: expect.any(Number),
        lastName: "PHContact1-Last",
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
      readingSpaces: ["reading corner", "dedicated reading room"],
      moa: {
        id: expect.any(Number),
        moaStatus: "submitted",
      },
    });
  });

  test("works: updating readingSpaces", async function () {
    let library = await Library.update(testLibraryIds[0], updateData3);
    expect(library).toEqual({
      libraryData: {
        classrooms: 3,
        libraryName: "Elementary School Library 1",
        libraryType: "elementary school",
        program: "FSER",
        studentsPerGrade: 20,
        teachers: 3,
        totalResidents: 0,
        elementaryVisitors: 0,
        highSchoolVisitors: 0,
        collegeVisitors: 0,
        adultVisitors: 0,
      },
      primaryAddress: {
        barangay: "barangay1",
        city: "city1",
        province: "Metro Manila",
        region: "Luzon",
        street: "street1",
      },
      USContact: {
        email: "ustestcontact1@test.com",
        firstName: "USContact1-First",
        lastName: "USContact1-Last",
        phone: "123-456-7890",
      },
      PHContact: {
        email: "phtestcontact1@test.com",
        firstName: "PHContact1-First",
        lastName: "PHContact1-Last",
        phone: "123-456-7890",
      },
      readingSpaces: ["dedicated reading room"],
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
        totalResidents: 0,
        elementaryVisitors: 0,
        highSchoolVisitors: 0,
        collegeVisitors: 0,
        adultVisitors: 0,
      },
      admin: {
        email: "testuser1@test.com",
        firstName: "User1First",
        id: expect.any(Number),
        lastName: "User1Last",
        phone: "123-456-7890",
      },
      USContact: {
        email: "ustestcontact1@test.com",
        firstName: "USContact1-First",
        id: expect.any(Number),
        lastName: "USContact1-Last",
        phone: "123-456-7890",
      },
      PHContact: {
        email: "phtestcontact1@test.com",
        firstName: "PHContact1-First",
        id: expect.any(Number),
        lastName: "PHContact1-Last",
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
      readingSpaces: ["dedicated reading room"],
      moa: {
        id: expect.any(Number),
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

/************************************** getRegionsAndProvinces */

describe("get regions and provinces", function () {
  test("works", async function () {
    const res = await Library.getRegionsAndProvinces();
    expect(res.provinces.length).toEqual(81);
    expect(res.regions.length).toEqual(3);
  });
});
