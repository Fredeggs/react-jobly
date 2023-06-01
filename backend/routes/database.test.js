"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  tokens,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /database/regions-and-provinces */

describe("GET /database/regions-and-provinces", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .get(`/database/regions-and-provinces`)
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.body.provinces.length).toEqual(81);
    expect(resp.body.regions.length).toEqual(3);
  });

  test("works for non-admin", async function () {
    const resp = await request(app)
      .get(`/database/regions-and-provinces`)
      .set("authorization", `Bearer ${tokens.u1Token}`);
    expect(resp.body.provinces.length).toEqual(81);
    expect(resp.body.regions.length).toEqual(3);
  });
});
