"use strict";

/** Routes for performing any kind of API call to PDFNet/Apryse */

const { PDFNet } = require("@pdftron/pdfnet-node");
const { PDFNET_KEY } = require("../config");
const { uploadMOAToS3, getMOAPresignedUrls } = require("../helpers/s3");
const fs = require("fs");
const path = require("path");

((exports) => {
  exports.runContentReplacer = async (data) => {
    const main = async () => {
      await PDFNet.initialize(PDFNET_KEY);
      const inputPath = path.resolve(__dirname, "../files/MOA_template.pdf");
      const outputPath = path.resolve(__dirname, `../files/MOA_${data.id}.pdf`);

      const doc = await PDFNet.PDFDoc.createFromFilePath(inputPath);
      doc.initSecurityHandler();

      const replacer = await PDFNet.ContentReplacer.create();
      const page1 = await doc.getPage(1);
      const page2 = await doc.getPage(2);
      const page3 = await doc.getPage(3);

      await replacer.addString("libraryName", data.libraryName);
      await replacer.addString("street", data.street);
      await replacer.addString("barangay", data.barangay);
      await replacer.addString("city", data.city);
      await replacer.addString("province", data.province);
      await replacer.addString("region", data.region);
      await replacer.addString("adminFirst", data.adminFirst);
      await replacer.addString("adminLast", data.adminLast);
      await replacer.addString("adminEmail", data.adminEmail);
      await replacer.addString("adminPhone", data.adminPhone);
      await replacer.addString("PHContactFirst", data.PHContactFirst);
      await replacer.addString("PHContactLast", data.PHContactLast);
      await replacer.addString("PHContactEmail", data.PHContactEmail);
      await replacer.addString("PHContactPhone", data.PHContactPhone);
      await replacer.addString("USContactFirst", data.USContactFirst);
      await replacer.addString("USContactLast", data.USContactLast);
      await replacer.addString("USContactEmail", data.USContactEmail);
      await replacer.addString("USContactPhone", data.USContactPhone);
      await replacer.process(page1);
      await replacer.process(page2);
      await replacer.process(page3);

      await doc.save(outputPath, PDFNet.SDFDoc.SaveOptions.e_remove_unused);
    };
    await PDFNet.runWithCleanup(main, PDFNET_KEY);

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let file;
    const uploadFromDirectory = async () => {
      await delay(500);
      fs.readFile(
        path.join(__dirname, `../files/MOA_${data.id}.pdf`),
        async function (err, fileData) {
          if (err) {
            console.error(err);
          }
          file = fileData;
          await uploadMOAToS3({ file: file, libraryId: data.id });
        }
      );

      fs.unlink(
        path.join(__dirname, `../files/MOA_${data.id}.pdf`),
        async function (err) {
          if (err) console.error(err);
        }
      );
    };
    await uploadFromDirectory();
  };
})(exports);
