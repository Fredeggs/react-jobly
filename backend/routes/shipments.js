"use strict";

/** Routes for shipments. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const {
  ensureAdmin,
  ensureLoggedIn,
  ensureCorrectUserOrAdmin,
} = require("../middleware/auth");
const Shipment = require("../models/shipment");

const shipmentNewSchema = require("../schemas/shipmentNew.json");
// const shipmentUpdateSchema = require("../schemas/shipmentUpdate.json");
// const shipmentSearchSchema = require("../schemas/shipmentSearch.json");

const router = new express.Router();

/** POST / { shipment } =>  { shipment }
 *
 * shipment is { export_declaration, invoice_num, boxes }
 *
 * Returns { id, exportDeclaration, invoiceNum, boxes, datePacked, receiptURL, receiptDate, libraryId}
 *
 * Authorization required: admin
 */

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, shipmentNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const shipment = await Shipment.createShipment(req.body);
    return res.status(201).json({ shipment });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { shipments: [ { handle, name, description, numEmployees, logoUrl }, ...] }
 *
 *
 * Authorization required: admin
 */

router.get("/", ensureAdmin, async function (req, res, next) {
  try {
    const shipments = await Shipment.findAll();
    return res.json({ shipments });
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
