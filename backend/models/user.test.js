"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testLibraryIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** authenticate */

describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("testuser1@test.com", "password1");
    expect(user).toEqual({
      id: 1,
      firstName: "User1First",
      lastName: "User1Last",
      email: "testuser1@test.com",
      phone: "123-456-7890",
      isAdmin: false,
    });
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("nope", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("c1", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/************************************** register */

describe("register", function () {
  const newUser = {
    id: expect.any(Number),
    firstName: "Test",
    lastName: "Tester",
    email: "test@test.com",
    phone: "123-456-7890",
    isAdmin: false,
  };

  test("works", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
    });
    expect(user).toEqual(newUser);
    const found = await db.query(
      "SELECT * FROM users WHERE email = 'test@test.com'"
    );
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(false);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("works: adds admin", async function () {
    let user = await User.register({
      ...newUser,
      password: "password",
      isAdmin: true,
    });
    expect(user).toEqual({ ...newUser, isAdmin: true });
    const found = await db.query(
      "SELECT * FROM users WHERE email = 'test@test.com'"
    );
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].is_admin).toEqual(true);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with dup data", async function () {
    try {
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works", async function () {
    const users = await User.findAll();
    expect(users).toEqual([
      {
        id: 1,
        firstName: "User1First",
        lastName: "User1Last",
        email: "testuser1@test.com",
        phone: "123-456-7890",
        isAdmin: false,
      },
      {
        id: 2,
        firstName: "AdminFirst",
        lastName: "AdminLast",
        email: "testadmin@test.com",
        phone: "123-456-7890",
        isAdmin: true,
      },
      {
        id: 3,
        firstName: "User2First",
        lastName: "User2Last",
        email: "testuser2@test.com",
        phone: "123-456-7890",
        isAdmin: false,
      },
      {
        id: 4,
        firstName: "User3First",
        lastName: "User3Last",
        email: "testuser3@test.com",
        phone: "123-456-7890",
        isAdmin: false,
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let user = await User.get("testuser1@test.com");
    expect(user).toEqual({
      id: 1,
      firstName: "User1First",
      lastName: "User1Last",
      email: "testuser1@test.com",
      phone: "123-456-7890",
      isAdmin: false,
      libraryId: expect.any(Number),
      moaStatus: "submitted",
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.get("DNEuser@test.com");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    firstName: "NewF",
    lastName: "NewF",
    phone: "000-000-0000",
    isAdmin: true,
  };

  test("works", async function () {
    let updatedUser = await User.update("testuser1@test.com", updateData);
    expect(updatedUser).toEqual({
      id: 1,
      email: "testuser1@test.com",
      ...updateData,
    });
  });

  test("works: set password", async function () {
    let updatedUser = await User.update("testuser1@test.com", {
      password: "new",
    });
    expect(updatedUser).toEqual({
      id: 1,
      firstName: "User1First",
      lastName: "User1Last",
      email: "testuser1@test.com",
      phone: "123-456-7890",
      isAdmin: false,
    });
    const found = await db.query("SELECT * FROM users WHERE id = 1");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("not found if no such user", async function () {
    try {
      await User.update("DNEuser@test.com", {
        firstName: "test",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if no data", async function () {
    expect.assertions(1);
    try {
      await User.update("testuser1@test.com", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await User.remove("testuser1@test.com");
    const res = await db.query(
      "SELECT * FROM users WHERE email='testuser1@test.com'"
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
      await User.remove("DNEuser@test.com");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
