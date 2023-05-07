"use strict";

/** Routes for libraries. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const {
  ensureAdmin,
  ensureLoggedIn,
  ensureCorrectUserOrAdmin,
} = require("../middleware/auth");
const Library = require("../models/library");

const libraryNewSchema = require("../schemas/libraryNew.json");
const libraryUpdateSchema = require("../schemas/libraryUpdate.json");
const librarySearchSchema = require("../schemas/librarySearch.json");

const router = new express.Router();

/** POST / { library } =>  { library }
 *
 * library is { libraryData, contactData, primaryAddress, shippingAddress, adminId }
 *
 * Returns { id, adminId, libraryData, contactData, primaryAddress, shippingAddress}
 * where libraryData = { libraryName, libraryType, program, classrooms, teachers, studentsPerGrade }
 * where contactData = { id, firstName, lastName, phone, email, libraryId }
 * where primaryAddress = { street, barangay, city, province, region }
 * where shippingAddress = { street, barangay, city, province, region }
 *
 * Authorization required: user/admin
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, libraryNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const library = await Library.createLibrary(req.body);
    return res.status(201).json({ library });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { libraries: [ { handle, name, description, numEmployees, logoUrl }, ...] }
 *
 * Can filter on provided search filters:
 * - nameLike (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 */

router.get("/", ensureAdmin, async function (req, res, next) {
  const q = req.query;

  try {
    const validator = jsonschema.validate(q, librarySearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const libraries = await Library.findAll(q);
    return res.json({ libraries });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  =>  { library }
 *
 * library is { libraryData, contactData, primaryAddress, shippingAddress, adminId }
 *
 * Returns { id, adminId, libraryData, contactData, primaryAddress, shippingAddress}
 * where libraryData = { libraryName, libraryType, program, classrooms, teachers, studentsPerGrade }
 * where contactData = { id, firstName, lastName, phone, email, libraryId }
 * where primaryAddress = { street, barangay, city, province, region }
 * where shippingAddress = { street, barangay, city, province, region }
 *
 * Authorization required: admin
 */

router.get("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const library = await Library.get(req.params.id);
    return res.json({ library });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id] { fld1, fld2, ... } => { library }
 *
 * Patches library data.
 *
 * fields can be: { libraryData, contactData, primaryAddress, shippingAddress }
 *
 * where libraryData = { libraryName, libraryType, program, classrooms, teachers, studentsPerGrade }
 * where contactData = { id, firstName, lastName, phone, email, libraryId }
 * where primaryAddress = { street, barangay, city, province, region }
 * where shippingAddress = { street, barangay, city, province, region }
 *
 * Returns { handle, name, description, numEmployees, logo_url }
 *
 * Authorization required: correct user or admin
 */

router.patch("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, libraryUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const library = await Library.update(req.params.id, req.body);
    return res.json({ library });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    await Library.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
