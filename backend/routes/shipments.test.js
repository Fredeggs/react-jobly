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

/************************************** GET /shipments/:id */

describe("GET /shipments/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .get(`/shipments/1}`)
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.body).toEqual({
      shipment: {
        id: 1,
        boxes: 2,
        datePacked: "1/8/2022",
        exportDeclaration: 123,
        invoiceNum: 321,
        libraryId: testLibraryIds[0],
        libraryName: "Middle School Library",
        receiptDate: "1/13/2022",
        receiptURL: "link to receipt 1",
      },
    });
  });

  test("works for correct user", async function () {
    const resp = await request(app)
      .get(`/shipments/1}`)
      .set("authorization", `Bearer ${tokens.u1Token}`);
    expect(resp.body).toEqual({
      shipment: {
        id: 1,
        boxes: 2,
        datePacked: "1/8/2022",
        exportDeclaration: 123,
        invoiceNum: 321,
        libraryId: testLibraryIds[0],
        libraryName: "Middle School Library",
        receiptDate: "1/13/2022",
        receiptURL: "link to receipt 1",
      },
    });
  });

  test("not found for no such library", async function () {
    const resp = await request(app)
      .get(`/shipments/0`)
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /shipments/:id */

describe("PATCH /shipments/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .patch(`/shipments/1}`)
      .send({
        boxes: 45,
      })
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.body).toEqual({
      shipment: {
        boxes: 45,
        datePacked: "1/8/2022",
        exportDeclaration: 123,
        invoiceNum: 321,
        receiptDate: "1/13/2022",
        receiptURL: "link to receipt 1",
      },
    });
  });

  test("works for correct user", async function () {
    const resp = await request(app)
      .patch(`/shipments/1}`)
      .send({
        boxes: 45,
      })
      .set("authorization", `Bearer ${tokens.u1Token}`);
    expect(resp.body).toEqual({
      shipment: {
        boxes: 45,
        datePacked: "1/8/2022",
        exportDeclaration: 123,
        invoiceNum: 321,
        receiptDate: "1/13/2022",
        receiptURL: "link to receipt 1",
      },
    });
  });

  test("unauth for incorrect user", async function () {
    const resp = await request(app)
      .patch(`/shipments/1`)
      .send({ boxes: 45 })
      .set("authorization", `Bearer ${tokens.u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).patch(`/shipments/1`).send({
      boxes: 45,
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such library", async function () {
    const resp = await request(app)
      .patch(`/shipments/0`)
      .send({
        boxes: 45,
      })
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on id change attempt", async function () {
    const resp = await request(app)
      .patch(`/shipments/1`)
      .send({
        id: 24,
      })
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on invalid data", async function () {
    const resp = await request(app)
      .patch(`/shipments/1`)
      .send({
        invalidField: "invalid",
      })
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /shipments/:id */

describe("DELETE /shipments/:id", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .delete(`/shipments/1`)
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.body).toEqual({ deleted: "1" });
  });

  test("unauth for non-admin", async function () {
    const resp = await request(app)
      .delete(`/shipments/1`)
      .set("authorization", `Bearer ${tokens.u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete(`/shipments/1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such shipment", async function () {
    const resp = await request(app)
      .delete(`/shipments/0`)
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});
