"use strict";

/** Express app for jobly. */

const express = require("express");
const cors = require("cors");
const { PDFNet } = require("@pdftron/pdfnet-node");
const path = require("path");
const fs = require("fs");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const librariesRoutes = require("./routes/libraries");
const usersRoutes = require("./routes/users");
const shipmentsRoutes = require("./routes/shipments");
const databaseRoutes = require("./routes/database");
const moasRoutes = require("./routes/moas");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/libraries", librariesRoutes);
app.use("/users", usersRoutes);
app.use("/shipments", shipmentsRoutes);
app.use("/moas", moasRoutes);
app.use("/database", databaseRoutes);

// converting office to PDF route
app.get("/convertFromOffice", (req, res) => {
  const { filename } = req.query;
  
});

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
