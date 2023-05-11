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

/************************************** POST /shipments */

describe("POST /shipments", function () {
  const newShipment = {
    exportDeclaration: 111,
    invoiceNum: 222,
    datePacked: "2022-10-22",
    boxes: 10,
  };

  test("works for admin", async function () {
    const newTestShipment = {
      ...newShipment,
      libraryId: testLibraryIds[0],
    };
    const resp = await request(app)
      .post("/shipments")
      .send(newTestShipment)
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      shipment: {
        id: expect.any(Number),
        exportDeclaration: 111,
        invoiceNum: 222,
        datePacked: "10/22/2022",
        boxes: 10,
        receiptURL: null,
        receiptDate: null,
        libraryId: testLibraryIds[0],
      },
    });
  });

  test("unauth for user", async function () {
    const newTestShipment = {
      ...newShipment,
      libraryId: testLibraryIds[0],
    };
    const resp = await request(app)
      .post("/shipments")
      .send(newTestShipment)
      .set("authorization", `Bearer ${tokens.u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const newTestShipment = {
      ...newShipment,
      libraryId: testLibraryIds[0],
    };
    const resp = await request(app).post("/shipments").send(newTestShipment);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const newTestShipment = {
      libraryId: testLibraryIds[0],
    };
    const resp = await request(app)
      .post("/shipments")
      .send(newTestShipment)
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request trying to create a shipment for a library that does not exist", async function () {
    const newTestShipment = {
      ...newShipment,
      libraryId: 0,
    };
    const resp = await request(app)
      .post("/shipments")
      .send(newTestShipment)
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** GET /shipments */

describe("GET /shipments", function () {
  test("ok for admin", async function () {
    const resp = await request(app)
      .get("/shipments")
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.body).toEqual({
      shipments: [
        {
          id: expect.any(Number),
          boxes: 1,
          datePacked: "3/23/2022",
          exportDeclaration: 456,
          invoiceNum: 654,
          libraryId: testLibraryIds[1],
          libraryName: "Elementary School Library",
          receiptDate: null,
          receiptURL: null,
        },
        {
          id: expect.any(Number),
          boxes: 4,
          datePacked: "3/14/2022",
          exportDeclaration: 789,
          invoiceNum: 987,
          libraryId: testLibraryIds[1],
          libraryName: "Elementary School Library",
          receiptDate: "3/25/2022",
          receiptURL: "link to receipt 2",
        },
        {
          id: expect.any(Number),
          boxes: 2,
          datePacked: "1/8/2022",
          exportDeclaration: 123,
          invoiceNum: 321,
          libraryId: testLibraryIds[0],
          libraryName: "Middle School Library",
          receiptDate: "1/13/2022",
          receiptURL: "link to receipt 1",
        },
      ],
    });
  });

  test("unauth for non-admin", async function () {
    const resp = await request(app)
      .get("/shipments")
      .set("authorization", `Bearer ${tokens.u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });
});

// /************************************** GET /libraries/:id */

// describe("GET /libraries/:id", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//       .get(`/libraries/${testLibraryIds[0]}`)
//       .set("authorization", `Bearer ${tokens.adminToken}`);
//     expect(resp.body).toEqual({
//       library: {
//         id: testLibraryIds[0],
//         admin: {
//           id: testUserIds[0],
//           email: "user1@user.com",
//           firstName: "U1F",
//           lastName: "U1L",
//           phone: "1111111111",
//         },
//         libraryData: {
//           libraryName: "Middle School Library",
//           libraryType: "middle school",
//           classrooms: 1,
//           studentsPerGrade: 10,
//           teachers: 3,
//           program: "FSER",
//         },
//         contactData: {
//           id: expect.any(Number),
//           firstName: "First",
//           lastName: "Last",
//           phone: "000-000-0000",
//           email: "contact1@gmail.com",
//         },
//         primaryAddress: {
//           id: expect.any(Number),
//           street: "Primary Street",
//           barangay: "Primary Barangay",
//           city: "Primary City",
//           province: "Abra",
//           region: "Luzon",
//         },
//         shippingAddress: {
//           id: expect.any(Number),
//           street: "Shipping Street",
//           barangay: "Shipping Barangay",
//           city: "Shipping City",
//           province: "Abra",
//           region: "Luzon",
//         },
//         moa: {
//           id: expect.any(Number),
//           link: "testLink1",
//           moaStatus: "submitted",
//         },
//       },
//     });
//   });

//   test("works for correct user", async function () {
//     const resp = await request(app)
//       .get(`/libraries/${testLibraryIds[0]}`)
//       .set("authorization", `Bearer ${tokens.u1Token}`);
//     expect(resp.body).toEqual({
//       library: {
//         id: testLibraryIds[0],
//         admin: {
//           id: testUserIds[0],
//           email: "user1@user.com",
//           firstName: "U1F",
//           lastName: "U1L",
//           phone: "1111111111",
//         },
//         libraryData: {
//           libraryName: "Middle School Library",
//           libraryType: "middle school",
//           classrooms: 1,
//           studentsPerGrade: 10,
//           teachers: 3,
//           program: "FSER",
//         },
//         contactData: {
//           id: expect.any(Number),
//           firstName: "First",
//           lastName: "Last",
//           phone: "000-000-0000",
//           email: "contact1@gmail.com",
//         },
//         primaryAddress: {
//           id: expect.any(Number),
//           street: "Primary Street",
//           barangay: "Primary Barangay",
//           city: "Primary City",
//           province: "Abra",
//           region: "Luzon",
//         },
//         shippingAddress: {
//           id: expect.any(Number),
//           street: "Shipping Street",
//           barangay: "Shipping Barangay",
//           city: "Shipping City",
//           province: "Abra",
//           region: "Luzon",
//         },
//         moa: {
//           id: expect.any(Number),
//           link: "testLink1",
//           moaStatus: "submitted",
//         },
//       },
//     });
//   });

//   test("not found for no such library", async function () {
//     const resp = await request(app)
//       .get(`/libraries/0`)
//       .set("authorization", `Bearer ${tokens.adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });

// /************************************** PATCH /companies/:handle */

// describe("PATCH /libraries/:id", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//       .patch(`/libraries/${testLibraryIds[0]}`)
//       .send({
//         libraryData: {
//           libraryName: "Updated Library Name",
//         },
//         contactData: {},
//         primaryAddress: {},
//         shippingAddress: {},
//       })
//       .set("authorization", `Bearer ${tokens.adminToken}`);
//     expect(resp.body).toEqual({
//       library: {
//         libraryData: {
//           libraryName: "Updated Library Name",
//           libraryType: "middle school",
//           classrooms: 1,
//           studentsPerGrade: 10,
//           teachers: 3,
//           program: "FSER",
//         },
//         contactData: {
//           email: "contact1@gmail.com",
//           firstName: "First",
//           lastName: "Last",
//           phone: "000-000-0000",
//         },
//         primaryAddress: {
//           barangay: "Primary Barangay",
//           city: "Primary City",
//           province: "Abra",
//           region: "Luzon",
//           street: "Primary Street",
//         },
//         shippingAddress: {
//           barangay: "Shipping Barangay",
//           city: "Shipping City",
//           province: "Abra",
//           region: "Luzon",
//           street: "Shipping Street",
//         },
//       },
//     });
//   });

//   test("works for correct user", async function () {
//     const resp = await request(app)
//       .patch(`/libraries/${testLibraryIds[0]}`)
//       .send({
//         libraryData: {
//           libraryName: "Updated Library Name",
//         },
//         contactData: {},
//         primaryAddress: {},
//         shippingAddress: {},
//       })
//       .set("authorization", `Bearer ${tokens.u1Token}`);
//     expect(resp.body).toEqual({
//       library: {
//         libraryData: {
//           libraryName: "Updated Library Name",
//           libraryType: "middle school",
//           classrooms: 1,
//           studentsPerGrade: 10,
//           teachers: 3,
//           program: "FSER",
//         },
//         contactData: {
//           email: "contact1@gmail.com",
//           firstName: "First",
//           lastName: "Last",
//           phone: "000-000-0000",
//         },
//         primaryAddress: {
//           barangay: "Primary Barangay",
//           city: "Primary City",
//           province: "Abra",
//           region: "Luzon",
//           street: "Primary Street",
//         },
//         shippingAddress: {
//           barangay: "Shipping Barangay",
//           city: "Shipping City",
//           province: "Abra",
//           region: "Luzon",
//           street: "Shipping Street",
//         },
//       },
//     });
//   });

//   test("unauth for non-admin", async function () {
//     const resp = await request(app)
//       .patch(`/libraries/${testLibraryIds[0]}`)
//       .send({
//         libraryData: {
//           libraryName: "Updated Library Name",
//         },
//         contactData: {},
//         primaryAddress: {},
//         shippingAddress: {},
//       })
//       .set("authorization", `Bearer ${tokens.u2Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//       .patch(`/libraries/${testLibraryIds[0]}`)
//       .send({
//         libraryData: {
//           libraryName: "Updated Library Name",
//         },
//         contactData: {},
//         primaryAddress: {},
//         shippingAddress: {},
//       });
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found on no such library", async function () {
//     const resp = await request(app)
//       .patch(`/libraries/0`)
//       .send({
//         libraryData: {
//           libraryName: "Updated Library Name",
//         },
//         contactData: {},
//         primaryAddress: {},
//         shippingAddress: {},
//       })
//       .set("authorization", `Bearer ${tokens.adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });

//   test("bad request on id change attempt", async function () {
//     const resp = await request(app)
//       .patch(`/libraries/${testLibraryIds[0]}`)
//       .send({
//         libraryData: {
//           libraryName: "Updated Library Name",
//         },
//         contactData: {},
//         primaryAddress: {},
//         shippingAddress: {},
//         adminId: 45,
//       })
//       .set("authorization", `Bearer ${tokens.adminToken}`);
//     expect(resp.statusCode).toEqual(400);
//   });

//   test("bad request on invalid data", async function () {
//     const resp = await request(app)
//       .patch(`/libraries/${testLibraryIds[0]}`)
//       .send({
//         invalidField: "invalid",
//       })
//       .set("authorization", `Bearer ${tokens.adminToken}`);
//     expect(resp.statusCode).toEqual(400);
//   });
// });

// /************************************** DELETE /companies/:handle */

// describe("DELETE /libraries/:id", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//       .delete(`/libraries/${testLibraryIds[0]}`)
//       .set("authorization", `Bearer ${tokens.adminToken}`);
//     expect(resp.body).toEqual({ deleted: testLibraryIds[0].toString() });
//   });

//   test("unauth for non-admin", async function () {
//     const resp = await request(app)
//       .delete(`/libraries/${testLibraryIds[0]}`)
//       .set("authorization", `Bearer ${tokens.u1Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app).delete(`/libraries/${testLibraryIds[0]}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found for no such library", async function () {
//     const resp = await request(app)
//       .delete(`/libraries/0`)
//       .set("authorization", `Bearer ${tokens.adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });
