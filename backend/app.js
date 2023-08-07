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
// app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/libraries", librariesRoutes);
app.use("/users", usersRoutes);
app.use("/shipments", shipmentsRoutes);
app.use("/moas", moasRoutes);
app.use("/database", databaseRoutes);

// replace text in a PDF template
app.get("/generateInvoice", (req, res) => {
  const inputPath = path.resolve(__dirname, "./files/MOA_template.pdf");
  const outputPath = path.resolve(__dirname, "./files/MOA_replaced.pdf");

  const replaceText = async () => {
    const pdfdoc = await PDFNet.PDFDoc.createFromFilePath(inputPath);
    await pdfdoc.initSecurityHandler();
    const replacer = await PDFNet.ContentReplacer.create();
    const page = await pdfdoc.getPage(1);

    await replacer.addString()
  }
});

// converting office to PDF route
app.get("/convertFromOffice", (req, res) => {
  const { filename } = req.query;

  const inputPath = path.resolve(__dirname, `./files/${filename}.docx`);
  const outputPath = path.resolve(__dirname, `./files/${filename}.pdf`);

  const convertToPDF = async () => {
    const pdfdoc = await PDFNet.PDFDoc.create();
    await pdfdoc.initSecurityHandler();
    await PDFNet.Convert.toPdf(pdfdoc, inputPath);
    pdfdoc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_linearized);
  };

  PDFNet.runWithCleanup(
    convertToPDF,
    "demo:1691424077967:7c5f6ef00300000000836250f8cfc3d7928796ab65c20e1409cbf9259a"
  )
    .then(() => {
      fs.readFile(outputPath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end(err);
        } else {
          res.setHeader("ContentType", "application/pdf");
          res.end(data);
        }
      });
    })
    .catch((err) => {
      res.statusCode = 500;
      res.end(err);
    });
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
