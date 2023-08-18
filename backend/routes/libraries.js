"use strict";

/** Routes for libraries. */

const jsonschema = require("jsonschema");
const express = require("express");
const { PDFNet } = require("@pdftron/pdfnet-node");
const fs = require("fs");

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
const Shipment = require("../models/shipment");
const { runContentReplacer } = require("../helpers/PDFNet");

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
    } else {
      const library = await Library.createLibrary(req.body);
      const templateData = {
        id: library.id,
        libraryName: library.libraryData.libraryName,
        street: library.primaryAddress.street,
        barangay: library.primaryAddress.barangay,
        city: library.primaryAddress.city,
        province: library.primaryAddress.province,
        region: library.primaryAddress.region,
        USContactFirst: library.USContact.firstName,
        USContactLast: library.USContact.lastName,
        USContactEmail: library.USContact.email,
        USContactPhone: library.USContact.phone,
        adminFirst: library.adminContact.firstName,
        adminLast: library.adminContact.lastName,
        adminEmail: library.adminContact.email,
        adminPhone: library.adminContact.phone,
        PHContactFirst: library.PHContact.firstName,
        PHContactLast: library.PHContact.lastName,
        PHContactEmail: library.PHContact.email,
        PHContactPhone: library.PHContact.phone,
      };
      await runContentReplacer(templateData);

      return res.status(201).json({ library });
    }
  } catch (err) {
    console.log(err);
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

/** GET /[libraryId]  =>  { library }
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

router.get(
  "/:libraryId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const library = await Library.get(req.params.libraryId);
      const shipments = await Shipment.getLibraryShipments(
        req.params.libraryId
      );
      return res.json({ library, shipments });
    } catch (err) {
      return next(err);
    }
  }
);

/** PATCH /[libraryId] { fld1, fld2, ... } => { library }
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

router.patch(
  "/:libraryId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, libraryUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const library = await Library.update(req.params.libraryId, req.body);
      return res.json({ library });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin
 */

router.delete("/:libraryId", ensureAdmin, async function (req, res, next) {
  try {
    await Library.remove(req.params.libraryId);
    return res.json({ deleted: req.params.libraryId });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
