"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");

const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");
const db = require("../db");

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const { email, password } = req.body;
    const user = await User.authenticate(email, password);
    const libraryIdRes = await db.query(
      `SELECT id FROM libraries WHERE admin_id = $1`,
      [user.id]
    );
    let shipmentsRes;
    if (libraryIdRes.rows[0]) {
      shipmentsRes = await db.query(
        `SELECT id FROM shipments WHERE library_id = $1`,
        [libraryIdRes.rows[0].id]
      );
    }
    const token = createToken({
      ...user,
      libraryId: libraryIdRes.rows.length > 0 ? libraryIdRes.rows[0].id : null,
      shipments: shipmentsRes ? shipmentsRes.rows : [],
    });
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegisterSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await User.register({ ...req.body, isAdmin: false });
    const token = createToken({ ...newUser, libraryId: null, shipments: [] });
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
