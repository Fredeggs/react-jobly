"use strict";

/** Routes for retieving pre-seeded information from the database
 * such as regions & provinces in the Philippines. */

const express = require("express");

const { ensureLoggedIn } = require("../middleware/auth");
const Database = require("../models/database");

const router = new express.Router();

/** GET /  =>  { provinces: [{id, name}, ...], regions: [{id, name}, ...] }
 *
 * Authorization: user
 */

router.get(
  "/regions-and-provinces",
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const data = await Database.getRegionsAndProvinces();
      return res.json(data);
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
