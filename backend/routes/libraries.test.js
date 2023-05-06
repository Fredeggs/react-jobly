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
  };

  test("ok for admin", async function () {
    const newTestLibrary = {
      ...newLibrary,
      adminId: testUserIds[3],
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
        contactData: {
          ...newTestLibrary.contactData,
          id: expect.any(Number),
          libraryId: expect.any(Number),
        },
        primaryAddress: {
          ...newTestLibrary.primaryAddress,
          id: expect.any(Number),
        },
        shippingAddress: {
          ...newTestLibrary.shippingAddress,
          id: expect.any(Number),
        },
      },
    });
  });

  test("ok for user", async function () {
    const newTestLibrary = {
      ...newLibrary,
      adminId: testUserIds[3],
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
        contactData: {
          ...newTestLibrary.contactData,
          id: expect.any(Number),
          libraryId: expect.any(Number),
        },
        primaryAddress: {
          ...newTestLibrary.primaryAddress,
          id: expect.any(Number),
        },
        shippingAddress: {
          ...newTestLibrary.shippingAddress,
          id: expect.any(Number),
        },
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
      adminId: testUserIds[3],
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
        contactData: {
          ...newTestLibrary.contactData,
          id: expect.any(Number),
          libraryId: expect.any(Number),
        },
        primaryAddress: {
          ...newTestLibrary.primaryAddress,
          id: expect.any(Number),
        },
        shippingAddress: {
          ...newTestLibrary.shippingAddress,
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
          shippingBarangay: "Shipping Barangay",
          shippingCity: "Shipping City",
          shippingProvince: "Agusan del Sur",
          shippingRegion: "Mindanao",
          shippingStreet: "Shipping Street",
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
          shippingBarangay: "Shipping Barangay",
          shippingCity: "Shipping City",
          shippingProvince: "Agusan del Norte",
          shippingRegion: "Visayas",
          shippingStreet: "Shipping Street",
        },
        {
          id: expect.any(Number),
          adminId: testUserIds[0],
          libraryName: "Middle School Library",
          libraryType: "middle school",
          primaryBarangay: "Primary Barangay",
          primaryCity: "Primary City",
          primaryProvince: "Abra",
          primaryRegion: "Luzon",
          primaryStreet: "Primary Street",
          shippingBarangay: "Shipping Barangay",
          shippingCity: "Shipping City",
          shippingProvince: "Abra",
          shippingRegion: "Luzon",
          shippingStreet: "Shipping Street",
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

  test("works: filtering", async function () {
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
          shippingBarangay: "Shipping Barangay",
          shippingCity: "Shipping City",
          shippingProvince: "Agusan del Sur",
          shippingRegion: "Mindanao",
          shippingStreet: "Shipping Street",
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
          libraryName: "Middle School Library",
          libraryType: "middle school",
          classrooms: 1,
          studentsPerGrade: 10,
          teachers: 3,
          program: "FSER",
        },
        contactData: {
          id: expect.any(Number),
          firstName: "First",
          lastName: "Last",
          phone: "000-000-0000",
          email: "contact1@gmail.com",
        },
        primaryAddress: {
          id: expect.any(Number),
          street: "Primary Street",
          barangay: "Primary Barangay",
          city: "Primary City",
          province: "Abra",
          region: "Luzon",
        },
        shippingAddress: {
          id: expect.any(Number),
          street: "Shipping Street",
          barangay: "Shipping Barangay",
          city: "Shipping City",
          province: "Abra",
          region: "Luzon",
        },
      },
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
          libraryName: "Middle School Library",
          libraryType: "middle school",
          classrooms: 1,
          studentsPerGrade: 10,
          teachers: 3,
          program: "FSER",
        },
        contactData: {
          id: expect.any(Number),
          firstName: "First",
          lastName: "Last",
          phone: "000-000-0000",
          email: "contact1@gmail.com",
        },
        primaryAddress: {
          id: expect.any(Number),
          street: "Primary Street",
          barangay: "Primary Barangay",
          city: "Primary City",
          province: "Abra",
          region: "Luzon",
        },
        shippingAddress: {
          id: expect.any(Number),
          street: "Shipping Street",
          barangay: "Shipping Barangay",
          city: "Shipping City",
          province: "Abra",
          region: "Luzon",
        },
      },
    });
  });

  test("not found for no such company", async function () {
    const resp = await request(app).get(`/companies/nope`);
    expect(resp.statusCode).toEqual(404);
  });
});

// /************************************** PATCH /companies/:handle */

// describe("PATCH /companies/:handle", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//         .patch(`/companies/c1`)
//         .send({
//           name: "C1-new",
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({
//       company: {
//         handle: "c1",
//         name: "C1-new",
//         description: "Desc1",
//         numEmployees: 1,
//         logoUrl: "http://c1.img",
//       },
//     });
//   });

//   test("unauth for non-admin", async function () {
//     const resp = await request(app)
//         .patch(`/companies/c1`)
//         .send({
//           name: "C1-new",
//         })
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//         .patch(`/companies/c1`)
//         .send({
//           name: "C1-new",
//         });
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found on no such company", async function () {
//     const resp = await request(app)
//         .patch(`/companies/nope`)
//         .send({
//           name: "new nope",
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });

//   test("bad request on handle change attempt", async function () {
//     const resp = await request(app)
//         .patch(`/companies/c1`)
//         .send({
//           handle: "c1-new",
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(400);
//   });

//   test("bad request on invalid data", async function () {
//     const resp = await request(app)
//         .patch(`/companies/c1`)
//         .send({
//           logoUrl: "not-a-url",
//         })
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(400);
//   });
// });

// /************************************** DELETE /companies/:handle */

// describe("DELETE /companies/:handle", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//         .delete(`/companies/c1`)
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({ deleted: "c1" });
//   });

//   test("unauth for non-admin", async function () {
//     const resp = await request(app)
//         .delete(`/companies/c1`)
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//         .delete(`/companies/c1`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found for no such company", async function () {
//     const resp = await request(app)
//         .delete(`/companies/nope`)
//         .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });
