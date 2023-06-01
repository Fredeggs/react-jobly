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
const shipmentUpdateSchema = require("../schemas/shipmentUpdate.json");

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
 *   { shipments: [ { id, exportDeclaration, invoiceNum, boxes, datePacked, receiptURL, receiptDate }, ...] }
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

/** GET /[id]  =>  { shipment }
 *
 * shipment is { id, exportDeclaration, invoiceNum, boxes, datePacked, receiptURL, receiptDate, libraryId }
 *
 * Authorization required: correct user or admin
 */

router.get("/:shippingId", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const shipment = await Shipment.get(parseInt(req.params.shippingId));
    return res.json({ shipment });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id] { fld1, fld2, ... } => { shipment }
 *
 * Patches shipment data.
 *
 * fields can be: { exportDeclaration, invoiceNum, boxes, datePacked, receiptURL, receiptDate }
 *
 * Returns { exportDeclaration, invoiceNum, boxes, datePacked, receiptURL, receiptDate }
 *
 * Authorization required: correct user or admin
 */

router.patch("/:shippingId", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, shipmentUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const shipment = await Shipment.update(parseInt(req.params.shippingId), req.body);
    return res.json({ shipment });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin
 */

router.delete("/:shippingId", ensureAdmin, async function (req, res, next) {
  try {
    await Shipment.remove(parseInt(req.params.shippingId));
    return res.json({ deleted: req.params.shippingId });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
