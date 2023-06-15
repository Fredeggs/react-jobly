"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError.js");
const MOA = require("./moa.js");
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

/************************************** create */

describe("create moa", function () {
  test("works", async function () {
    let moa = await MOA.create(testLibraryIds[2]);

    expect(moa).toEqual({
      moaStatus: "submitted",
      libraryId: testLibraryIds[2],
      id: expect.any(Number),
    });
  });

  test("bad request with dupe", async function () {
    try {
      await MOA.create(testLibraryIds[2]);
      await MOA.create(testLibraryIds[2]);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    moaStatus: "approved",
  };

  test("works", async function () {
    let moa = await MOA.update(testLibraryIds[0], updateData);
    expect(moa).toEqual({
      ...updateData,
      id: expect.any(Number),
      libraryId: testLibraryIds[0],
    });
  });

  test("not found if no such library", async function () {
    try {
      await MOA.update(0, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await MOA.update(testLibraryIds[0], {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
