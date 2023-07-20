"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  testLibraryIds,
  tokens,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /libraries */

describe("POST /libraries", function () {
  const newLibrary = {
    libraryData: {
      libraryName: "New Library",
      libraryType: "elementary school",
      classrooms: 1,
      studentsPerGrade: 2,
      teachers: 3,
      program: "FSER",
    },
    USContact: {
      firstName: "US-First",
      lastName: "US-Last",
      phone: "0000000000",
      email: "uscontact@gmail.com",
    },
    PHContact: {
      firstName: "PH-First",
      lastName: "PH-Last",
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
    readingSpaces: ["dedicated reading room", "reading corner"],
  };

  test("ok for admin", async function () {
    const newTestLibrary = {
      ...newLibrary,
      adminId: testUserIds[4],
    };
    const resp = await request(app)
      .post("/libraries")
      .send(newTestLibrary)
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      library: {
        ...newTestLibrary,
        id: expect.any(Number),
        USContact: {
          ...newTestLibrary.USContact,
          id: expect.any(Number),
          libraryId: expect.any(Number),
          contactType: "us-sponsor",
        },
        PHContact: {
          ...newTestLibrary.PHContact,
          id: expect.any(Number),
          libraryId: expect.any(Number),
          contactType: "ph-sponsor",
        },
        primaryAddress: {
          ...newTestLibrary.primaryAddress,
          id: expect.any(Number),
        },
        readingSpaces: ["dedicated reading room", "reading corner"],
      },
    });
  });

  test("ok for user", async function () {
    const newTestLibrary = {
      ...newLibrary,
      adminId: testUserIds[4],
    };
    const resp = await request(app)
      .post("/libraries")
      .send(newTestLibrary)
      .set("authorization", `Bearer ${tokens.u1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      library: {
        ...newTestLibrary,
        id: expect.any(Number),
        USContact: {
          ...newTestLibrary.USContact,
          id: expect.any(Number),
          libraryId: expect.any(Number),
          contactType: "us-sponsor",
        },
        PHContact: {
          ...newTestLibrary.PHContact,
          id: expect.any(Number),
          libraryId: expect.any(Number),
          contactType: "ph-sponsor",
        },
        primaryAddress: {
          ...newTestLibrary.primaryAddress,
          id: expect.any(Number),
        },
        readingSpaces: ["dedicated reading room", "reading corner"],
      },
    });
  });

  test("works with nulled classrooms, teachers, and studentsPerGrade data", async function () {
    const newTestLibrary = {
      ...newLibrary,
      libraryData: {
        ...newLibrary.libraryData,
        classrooms: null,
        teachers: null,
        studentsPerGrade: null,
      },
      adminId: testUserIds[4],
    };
    const resp = await request(app)
      .post("/libraries")
      .send(newTestLibrary)
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      library: {
        ...newTestLibrary,
        id: expect.any(Number),
        USContact: {
          ...newTestLibrary.USContact,
          id: expect.any(Number),
          libraryId: expect.any(Number),
          contactType: "us-sponsor",
        },
        PHContact: {
          ...newTestLibrary.PHContact,
          id: expect.any(Number),
          libraryId: expect.any(Number),
          contactType: "ph-sponsor",
        },
        primaryAddress: {
          ...newTestLibrary.primaryAddress,
          id: expect.any(Number),
        },
      },
    });
  });

  test("unauth for anon", async function () {
    const newTestLibrary = {
      ...newLibrary,
      adminId: testUserIds[3],
    };
    const resp = await request(app).post("/libraries").send(newTestLibrary);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const newTestLibrary = {
      ...newLibrary,
      adminId: null,
    };
    const resp = await request(app)
      .post("/libraries")
      .send(newTestLibrary)
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request trying to assign a library to a user that is already assigned to a library", async function () {
    const newTestLibrary = {
      ...newLibrary,
      adminId: testUserIds[0],
    };
    const resp = await request(app)
      .post("/libraries")
      .send(newTestLibrary)
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /libraries */

describe("GET /libraries", function () {
  test("ok for admin", async function () {
    const resp = await request(app)
      .get("/libraries")
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.body).toEqual({
      libraries: [
        {
          id: expect.any(Number),
          adminId: testUserIds[2],
          libraryName: "Community Library",
          libraryType: "community",
          primaryBarangay: "Primary Barangay",
          primaryCity: "Primary City",
          primaryProvince: "Agusan del Sur",
          primaryRegion: "Mindanao",
          primaryStreet: "Primary Street",
          moaStatus: null,
        },
        {
          id: expect.any(Number),
          adminId: testUserIds[3],
          libraryName: "Community Library 2",
          libraryType: "community",
          primaryBarangay: "Primary Barangay",
          primaryCity: "Primary City",
          primaryProvince: "Agusan del Sur",
          primaryRegion: "Mindanao",
          primaryStreet: "Primary Street",
          moaStatus: null,
        },
        {
          id: expect.any(Number),
          adminId: testUserIds[0],
          libraryName: "Day Care Library",
          libraryType: "day care",
          primaryBarangay: "Primary Barangay",
          primaryCity: "Primary City",
          primaryProvince: "Abra",
          primaryRegion: "Luzon",
          primaryStreet: "Primary Street",
          moaStatus: "submitted",
        },
        {
          id: expect.any(Number),
          adminId: testUserIds[1],
          libraryName: "Elementary School Library",
          libraryType: "elementary school",
          primaryBarangay: "Primary Barangay",
          primaryCity: "Primary City",
          primaryProvince: "Agusan del Norte",
          primaryRegion: "Visayas",
          primaryStreet: "Primary Street",
          moaStatus: "submitted",
        },
      ],
    });
  });

  test("unauth for non-admin", async function () {
    const resp = await request(app)
      .get("/libraries")
      .set("authorization", `Bearer ${tokens.u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("works: filtering by name", async function () {
    const resp = await request(app)
      .get("/libraries")
      .query({ name: "community" })
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.body).toEqual({
      libraries: [
        {
          id: expect.any(Number),
          adminId: testUserIds[2],
          libraryName: "Community Library",
          libraryType: "community",
          primaryBarangay: "Primary Barangay",
          primaryCity: "Primary City",
          primaryProvince: "Agusan del Sur",
          primaryRegion: "Mindanao",
          primaryStreet: "Primary Street",
          moaStatus: null,
        },
        {
          id: expect.any(Number),
          adminId: testUserIds[3],
          libraryName: "Community Library 2",
          libraryType: "community",
          primaryBarangay: "Primary Barangay",
          primaryCity: "Primary City",
          primaryProvince: "Agusan del Sur",
          primaryRegion: "Mindanao",
          primaryStreet: "Primary Street",
          moaStatus: null,
        },
      ],
    });
  });

  test("works: filtering by submittedMOA", async function () {
    const resp = await request(app)
      .get("/libraries")
      .query({ submittedMOA: true })
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.body).toEqual({
      libraries: [
        {
          id: expect.any(Number),
          adminId: testUserIds[0],
          libraryName: "Day Care Library",
          libraryType: "day care",
          primaryBarangay: "Primary Barangay",
          primaryCity: "Primary City",
          primaryProvince: "Abra",
          primaryRegion: "Luzon",
          primaryStreet: "Primary Street",
          moaStatus: "submitted",
        },
        {
          id: expect.any(Number),
          adminId: testUserIds[1],
          libraryName: "Elementary School Library",
          libraryType: "elementary school",
          primaryBarangay: "Primary Barangay",
          primaryCity: "Primary City",
          primaryProvince: "Agusan del Norte",
          primaryRegion: "Visayas",
          primaryStreet: "Primary Street",
          moaStatus: "submitted",
        },
      ],
    });
  });

  test("bad request if invalid filter key", async function () {
    const resp = await request(app)
      .get("/libraries")
      .query({ nope: "nope" })
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /libraries/:id */

describe("GET /libraries/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .get(`/libraries/${testLibraryIds[0]}`)
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.body).toEqual({
      library: {
        id: testLibraryIds[0],
        admin: {
          id: testUserIds[0],
          email: "user1@user.com",
          firstName: "U1F",
          lastName: "U1L",
          phone: "1111111111",
        },
        libraryData: {
          libraryName: "Day Care Library",
          libraryType: "day care",
          classrooms: 1,
          studentsPerGrade: 10,
          teachers: 3,
          program: "FSER",
        },
        USContact: {
          id: expect.any(Number),
          email: "uscontact1@gmail.com",
          firstName: "First",
          lastName: "Last",
          phone: "000-000-0000",
        },
        PHContact: {
          id: expect.any(Number),
          email: "phcontact1@gmail.com",
          firstName: "First",
          lastName: "Last",
          phone: "000-000-0000",
        },
        primaryAddress: {
          id: expect.any(Number),
          street: "Primary Street",
          barangay: "Primary Barangay",
          city: "Primary City",
          province: "Abra",
          region: "Luzon",
        },
        readingSpaces: ["dedicated reading room", "reading corner"],
        moa: {
          id: expect.any(Number),
          moaStatus: "submitted",
        },
      },
      shipments: [
        {
          boxes: 2,
          datePacked: "1/8/2022",
          exportDeclaration: 123,
          id: 1,
          invoiceNum: 321,
          receiptDate: "1/13/2022",
        },
      ],
    });
  });

  test("works for correct user", async function () {
    const resp = await request(app)
      .get(`/libraries/${testLibraryIds[0]}`)
      .set("authorization", `Bearer ${tokens.u1Token}`);
    expect(resp.body).toEqual({
      library: {
        id: testLibraryIds[0],
        admin: {
          id: testUserIds[0],
          email: "user1@user.com",
          firstName: "U1F",
          lastName: "U1L",
          phone: "1111111111",
        },
        libraryData: {
          libraryName: "Day Care Library",
          libraryType: "day care",
          classrooms: 1,
          studentsPerGrade: 10,
          teachers: 3,
          program: "FSER",
        },
        USContact: {
          id: expect.any(Number),
          email: "uscontact1@gmail.com",
          firstName: "First",
          lastName: "Last",
          phone: "000-000-0000",
        },
        PHContact: {
          id: expect.any(Number),
          email: "phcontact1@gmail.com",
          firstName: "First",
          lastName: "Last",
          phone: "000-000-0000",
        },
        primaryAddress: {
          id: expect.any(Number),
          street: "Primary Street",
          barangay: "Primary Barangay",
          city: "Primary City",
          province: "Abra",
          region: "Luzon",
        },
        readingSpaces: ["dedicated reading room", "reading corner"],
        moa: {
          id: expect.any(Number),
          moaStatus: "submitted",
        },
      },
      shipments: [
        {
          boxes: 2,
          datePacked: "1/8/2022",
          exportDeclaration: 123,
          id: 1,
          invoiceNum: 321,
          receiptDate: "1/13/2022",
        },
      ],
    });
  });

  test("not found for no such library", async function () {
    const resp = await request(app)
      .get(`/libraries/0`)
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /libraries/:id */

describe("PATCH /libraries/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .patch(`/libraries/${testLibraryIds[0]}`)
      .send({
        libraryData: {
          libraryName: "Updated Library Name",
        },
        USContact: {},
        PHContact: {},
        primaryAddress: {},
      })
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.body).toEqual({
      library: {
        libraryData: {
          libraryName: "Updated Library Name",
          libraryType: "day care",
          classrooms: 1,
          studentsPerGrade: 10,
          teachers: 3,
          program: "FSER",
        },
        USContact: {
          email: "uscontact1@gmail.com",
          firstName: "First",
          lastName: "Last",
          phone: "000-000-0000",
        },
        PHContact: {
          email: "phcontact1@gmail.com",
          firstName: "First",
          lastName: "Last",
          phone: "000-000-0000",
        },
        primaryAddress: {
          barangay: "Primary Barangay",
          city: "Primary City",
          province: "Abra",
          region: "Luzon",
          street: "Primary Street",
        },
        readingSpaces: ["dedicated reading room", "reading corner"],
      },
    });
  });

  test("works for correct user", async function () {
    const resp = await request(app)
      .patch(`/libraries/${testLibraryIds[0]}`)
      .send({
        libraryData: {
          libraryName: "Updated Library Name",
        },
        USContact: {},
        PHContact: {},
        primaryAddress: {},
      })
      .set("authorization", `Bearer ${tokens.u1Token}`);
    expect(resp.body).toEqual({
      library: {
        libraryData: {
          libraryName: "Updated Library Name",
          libraryType: "day care",
          classrooms: 1,
          studentsPerGrade: 10,
          teachers: 3,
          program: "FSER",
        },
        USContact: {
          email: "uscontact1@gmail.com",
          firstName: "First",
          lastName: "Last",
          phone: "000-000-0000",
        },
        PHContact: {
          email: "phcontact1@gmail.com",
          firstName: "First",
          lastName: "Last",
          phone: "000-000-0000",
        },
        primaryAddress: {
          barangay: "Primary Barangay",
          city: "Primary City",
          province: "Abra",
          region: "Luzon",
          street: "Primary Street",
        },
        readingSpaces: ["dedicated reading room", "reading corner"],
      },
    });
  });

  test("unauth for non-admin", async function () {
    const resp = await request(app)
      .patch(`/libraries/${testLibraryIds[0]}`)
      .send({
        libraryData: {
          libraryName: "Updated Library Name",
        },
        contactData: {},
        primaryAddress: {},
      })
      .set("authorization", `Bearer ${tokens.u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .patch(`/libraries/${testLibraryIds[0]}`)
      .send({
        libraryData: {
          libraryName: "Updated Library Name",
        },
        contactData: {},
        primaryAddress: {},
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such library", async function () {
    const resp = await request(app)
      .patch(`/libraries/0`)
      .send({
        libraryData: {
          libraryName: "Updated Library Name",
        },
        USContact: {},
        PHContact: {},
        primaryAddress: {},
      })
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on id change attempt", async function () {
    const resp = await request(app)
      .patch(`/libraries/${testLibraryIds[0]}`)
      .send({
        libraryData: {
          libraryName: "Updated Library Name",
        },
        contactData: {},
        primaryAddress: {},
        adminId: 45,
      })
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on invalid data", async function () {
    const resp = await request(app)
      .patch(`/libraries/${testLibraryIds[0]}`)
      .send({
        invalidField: "invalid",
      })
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /libraries/:id */

describe("DELETE /libraries/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .delete(`/libraries/${testLibraryIds[0]}`)
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.body).toEqual({ deleted: testLibraryIds[0].toString() });
  });

  test("unauth for non-admin", async function () {
    const resp = await request(app)
      .delete(`/libraries/${testLibraryIds[0]}`)
      .set("authorization", `Bearer ${tokens.u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete(`/libraries/${testLibraryIds[0]}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such library", async function () {
    const resp = await request(app)
      .delete(`/libraries/0`)
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});
