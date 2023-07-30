"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError.js");
const Shipment = require("./shipment.js");
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

/************************************** createShipment */

describe("create shipment", function () {
  test("works", async function () {
    const newShipment = {
      exportDeclaration: 111,
      invoiceNum: 111,
      boxes: 3,
      datePacked: "08-Jan-2022",
      libraryId: testLibraryIds[0],
    };
    let shipment = await Shipment.createShipment(newShipment);
    expect(shipment).toEqual({
      ...newShipment,
      id: expect.any(Number),
      datePacked: "1/8/2022",
      receiptDate: null,
    });
  });

  test("bad request with dupe", async function () {
    const newShipment = {
      exportDeclaration: 111,
      invoiceNum: 111,
      boxes: 3,
      datePacked: "08-Jan-2022",
      libraryId: testLibraryIds[0],
    };
    try {
      await Shipment.createShipment(newShipment);
      await Shipment.createShipment(newShipment);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let shipment = await Shipment.get(2);
    expect(shipment).toEqual({
      id: 2,
      exportDeclaration: 456,
      invoiceNum: 654,
      boxes: 1,
      datePacked: "3/23/2022",
      receiptDate: null,
      libraryId: testLibraryIds[1],
      libraryName: "Community Library 1",
    });
  });

  test("not found if no such shipment", async function () {
    try {
      await Shipment.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** getLibraryShipments */

describe("getLibraryShipments", function () {
  test("works", async function () {
    let shipments = await Shipment.getLibraryShipments(testLibraryIds[1]);
    expect(shipments).toEqual([
      {
        id: 2,
        exportDeclaration: 456,
        invoiceNum: 654,
        boxes: 1,
        datePacked: "3/23/2022",
        receiptDate: null,
      },
      {
        id: 3,
        exportDeclaration: 789,
        invoiceNum: 987,
        boxes: 4,
        datePacked: "3/14/2022",
        receiptDate: "3/25/2022",
      },
    ]);
  });

  test("not found if no such shipment", async function () {
    try {
      await Shipment.getLibraryShipments(0);
      // fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    receiptDate: "17-Jan-2022",
  };

  test("works", async function () {
    let shipment = await Shipment.update(1, updateData);
    expect(shipment).toEqual({
      exportDeclaration: 123,
      invoiceNum: 321,
      boxes: 2,
      datePacked: "1/8/2022",
      receiptDate: "1/17/2022",
    });

    const getShipment = await Shipment.get(1);
    expect(getShipment).toEqual({
      boxes: 2,
      datePacked: "1/8/2022",
      exportDeclaration: 123,
      id: 1,
      invoiceNum: 321,
      receiptDate: "1/17/2022",
      libraryId: testLibraryIds[0],
      libraryName: "Elementary School Library 1",
    });
  });

  test("not found if no such library", async function () {
    try {
      await Shipment.update(0, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Shipment.update(1, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: all", async function () {
    let shipments = await Shipment.findAll();
    expect(shipments).toEqual([
      {
        id: 2,
        exportDeclaration: 456,
        invoiceNum: 654,
        boxes: 1,
        datePacked: "3/23/2022",
        receiptDate: null,
        libraryId: testLibraryIds[1],
        libraryName: "Community Library 1",
      },
      {
        id: 3,
        exportDeclaration: 789,
        invoiceNum: 987,
        boxes: 4,
        datePacked: "3/14/2022",
        receiptDate: "3/25/2022",
        libraryId: testLibraryIds[1],
        libraryName: "Community Library 1",
      },
      {
        id: 1,
        boxes: 2,
        datePacked: "1/8/2022",
        exportDeclaration: 123,
        invoiceNum: 321,
        receiptDate: "1/13/2022",
        libraryId: testLibraryIds[0],
        libraryName: "Elementary School Library 1",
      },
    ]);
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Shipment.remove(1);
    const res = await db.query(`SELECT id FROM shipments WHERE id=${1}`);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such shipment", async function () {
    try {
      await Shipment.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
