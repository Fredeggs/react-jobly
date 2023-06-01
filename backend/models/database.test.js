"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError.js");
const Database = require("./database.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** getRegionsAndProvinces */

describe("get regions and provinces", function () {
  test("works", async function () {
    const res = await Database.getRegionsAndProvinces();
    expect(res.provinces.length).toEqual(81);
    expect(res.regions.length).toEqual(3);
  });
});
