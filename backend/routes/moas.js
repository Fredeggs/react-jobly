"use strict";

/** Routes for moas. */
const multer = require("multer");
const jsonschema = require("jsonschema");
const express = require("express");
const { BadRequestError } = require("../expressError");
const {
  ensureAdmin,
  ensureLoggedIn,
  ensureCorrectUserOrAdmin,
} = require("../middleware/auth");
const MOA = require("../models/moa");
const moaNewSchema = require("../schemas/moaNew.json");
const moaUpdateSchema = require("../schemas/moaUpdate.json");
const uploadMOAToS3 = require("../s3");
const router = new express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

/** POST / { moa } =>  { moa }
 *
 * moa is { link, moaStatus }
 *
 * Returns { id, link, moaStatus, libraryId}
 *
 * Authorization required: correct user or admin
 */

router.post(
  "/:libraryId",
  ensureCorrectUserOrAdmin,
  upload.single("moa"),
  async function (req, res, next) {
    try {
      const { file } = req;
      const libraryId = req.params.libraryId;
      if (!file || !libraryId) {
        throw new BadRequestError();
      }

      const { error, key } = uploadMOAToS3({ file, libraryId });
      if (error) return res.status(500).json({ message: error.message });

      const moa = await MOA.create(libraryId);

      return res.status(201).json({ key });
    } catch (err) {
      return next(err);
    }
  }
);

/** PATCH / { moa } =>  { moa }
 *
 * moa can be { moaLink, moaStatus }
 *
 * Returns { id, link, moaStatus, libraryId}
 *
 * Authorization required: admin
 */

router.patch(
  "/:libraryId",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, moaUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      const moa = await MOA.update(req.params.libraryId, req.body);
      return res.status(201).json({ moa });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
