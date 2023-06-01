"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testUserIds,
  tokens,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /users */

describe("POST /users", function () {
  test("works for admins: create non-admin", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        firstName: "First-new",
        lastName: "Last-new",
        password: "password-new",
        email: "new@email.com",
        phone: "1111111111",
        isAdmin: false,
      })
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        id: expect.any(Number),
        firstName: "First-new",
        lastName: "Last-new",
        email: "new@email.com",
        phone: "1111111111",
        isAdmin: false,
      },
      token: expect.any(String),
    });
  });

  test("works for admins: create admin", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        firstName: "First-new",
        lastName: "Last-new",
        password: "password-new",
        email: "new@email.com",
        phone: "1111111111",
        isAdmin: true,
      })
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        id: expect.any(Number),
        firstName: "First-new",
        lastName: "Last-new",
        email: "new@email.com",
        phone: "1111111111",
        isAdmin: true,
      },
      token: expect.any(String),
    });
  });

  test("unauth for users", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        firstName: "First-new",
        lastName: "Last-new",
        password: "password-new",
        email: "new@email.com",
        phone: "1111111111",
        isAdmin: true,
      })
      .set("authorization", `Bearer ${tokens.u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).post("/users").send({
      firstName: "First-new",
      lastName: "Last-new",
      password: "password-new",
      email: "new@email.com",
      phone: "1111111111",
      isAdmin: true,
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if missing data", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        username: "u-new",
      })
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
      .post("/users")
      .send({
        username: "u-new",
        firstName: "First-new",
        lastName: "Last-newL",
        password: "password-new",
        email: "not-an-email",
        isAdmin: true,
      })
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /users */

describe("GET /users", function () {
  test("works for admins", async function () {
    const resp = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.body).toEqual({
      users: [
        {
          id: expect.any(Number),
          firstName: "U1F",
          lastName: "U1L",
          email: "user1@user.com",
          phone: "1111111111",
          isAdmin: false,
        },
        {
          id: expect.any(Number),
          firstName: "U2F",
          lastName: "U2L",
          email: "user2@user.com",
          phone: "2222222222",
          isAdmin: false,
        },
        {
          id: expect.any(Number),
          firstName: "U3F",
          lastName: "U3L",
          email: "user3@user.com",
          phone: "3333333333",
          isAdmin: true,
        },
        {
          id: expect.any(Number),
          firstName: "U4F",
          lastName: "U4L",
          email: "user4@user.com",
          phone: "4444444444",
          isAdmin: false,
        },
      ],
    });
  });

  test("unauth for non-admin users", async function () {
    const resp = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${tokens.u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).get("/users");
    expect(resp.statusCode).toEqual(401);
  });

  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE users CASCADE");
    const resp = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** GET /users/:email */

describe("GET /users/:email", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .get(`/users/user1@user.com`)
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.body).toEqual({
      user: {
        id: testUserIds[0],
        firstName: "U1F",
        lastName: "U1L",
        email: "user1@user.com",
        phone: "1111111111",
        isAdmin: false,
        libraryId: expect.any(Number),
        moaStatus: "submitted",
      },
    });
  });

  test("works for same user", async function () {
    const resp = await request(app)
      .get(`/users/user1@user.com`)
      .set("authorization", `Bearer ${tokens.u1Token}`);
    expect(resp.body).toEqual({
      user: {
        id: testUserIds[0],
        firstName: "U1F",
        lastName: "U1L",
        email: "user1@user.com",
        phone: "1111111111",
        isAdmin: false,
        libraryId: expect.any(Number),
        moaStatus: "submitted",
      },
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .get(`/users/user1@user.com`)
      .set("authorization", `Bearer ${tokens.u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).get(`/users/user1@user.com`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user not found", async function () {
    const resp = await request(app)
      .get(`/users/DNEuser@user.com`)
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /users/:email */

describe("PATCH /users/:email", () => {
  test("works for admins", async function () {
    const resp = await request(app)
      .patch(`/users/user1@user.com`)
      .send({
        firstName: "New",
      })
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.body).toEqual({
      user: {
        id: testUserIds[0],
        firstName: "New",
        lastName: "U1L",
        email: "user1@user.com",
        phone: "1111111111",
        isAdmin: false,
      },
    });
  });

  test("works for same user", async function () {
    const resp = await request(app)
      .patch(`/users/user1@user.com`)
      .send({
        firstName: "New",
      })
      .set("authorization", `Bearer ${tokens.u1Token}`);
    expect(resp.body).toEqual({
      user: {
        id: testUserIds[0],
        firstName: "New",
        lastName: "U1L",
        email: "user1@user.com",
        phone: "1111111111",
        isAdmin: false,
      },
    });
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
      .patch(`/users/user1@user.com`)
      .send({
        firstName: "New",
      })
      .set("authorization", `Bearer ${tokens.u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).patch(`/users/user1@user.com`).send({
      firstName: "New",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such user", async function () {
    const resp = await request(app)
      .patch(`/users/DNEuser@user.com`)
      .send({
        firstName: "Nope",
      })
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
      .patch(`/users/user1@user.com`)
      .send({
        firstName: 42,
      })
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("works: can set new password", async function () {
    const resp = await request(app)
      .patch(`/users/user1@user.com`)
      .send({
        password: "new-password",
      })
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.body).toEqual({
      user: {
        id: testUserIds[0],
        firstName: "U1F",
        lastName: "U1L",
        email: "user1@user.com",
        phone: "1111111111",
        isAdmin: false,
      },
    });
    const isSuccessful = await User.authenticate(
      "user1@user.com",
      "new-password"
    );
    expect(isSuccessful).toBeTruthy();
  });
});

/************************************** DELETE /users/:username */

describe("DELETE /users/:email", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .delete(`/users/user1@user.com`)
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.body).toEqual({ deleted: "user1@user.com" });
  });

  test("works for same user", async function () {
    const resp = await request(app)
      .delete(`/users/user1@user.com`)
      .set("authorization", `Bearer ${tokens.u1Token}`);
    expect(resp.body).toEqual({ deleted: "user1@user.com" });
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
      .delete(`/users/user1@user.com`)
      .set("authorization", `Bearer ${tokens.u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete(`/users/user1@user.com`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user missing", async function () {
    const resp = await request(app)
      .delete(`/users/DNEuser@user.com`)
      .set("authorization", `Bearer ${tokens.adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});
