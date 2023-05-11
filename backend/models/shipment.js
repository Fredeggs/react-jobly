"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for companies. */

class Shipment {
  /** Create a shipment (from data), update db, return new shipment data.
   *
   * data should be { export_declaration, invoice_num, boxes }
   *
   * Returns { id, exportDeclaration, invoiceNum, boxes, datePacked, receiptURL, receiptDate, libraryId }
   *
   * Throws BadRequestError if shipment already in database.
   * */

  static async createShipment({
    exportDeclaration,
    invoiceNum,
    boxes,
    datePacked,
    libraryId,
  }) {
    const checkExistsRes = await db.query(
      `SELECT id
        FROM libraries
        WHERE id = $1`,
      [libraryId]
    );
    const checkExists = checkExistsRes.rows[0];
    if (!checkExists)
      throw new NotFoundError(`No library with id: ${libraryId}`);

    const duplicateShipmentCheck = await db.query(
      `SELECT export_declaration
           FROM shipments
           WHERE export_declaration = $1`,
      [exportDeclaration]
    );
    if (duplicateShipmentCheck.rows[0])
      throw new BadRequestError(
        `Duplicate shipment with export declaration number: ${exportDeclaration}`
      );

    const shipmentRes = await db.query(
      `INSERT INTO shipments
           (export_declaration, invoice_num, boxes, date_packed, receipt_url, receipt_date, library_id)
           VALUES ($1, $2, $3, $4, null, null, $5)
           RETURNING id, 
                    export_declaration AS "exportDeclaration",
                    invoice_num AS "invoiceNum",
                    boxes,
                    date_packed AS "datePacked",
                    receipt_url AS "receiptURL",
                    receipt_date AS "receiptDate",
                    library_id AS "libraryId"`,
      [exportDeclaration, invoiceNum, boxes, datePacked, libraryId]
    );
    const shipment = shipmentRes.rows[0];

    datePacked = new Date(`${shipment.datePacked}`);
    let receiptDate;
    if (shipment.receiptDate) {
      receiptDate = new Date(`${shipment.receiptDate}`);
      receiptDate = receiptDate.toLocaleDateString();
    }

    return {
      ...shipment,
      datePacked: datePacked.toLocaleDateString(),
      receiptDate: receiptDate || null,
    };

    return shipment;
  }

  /** GET: Given a shipment id, return data about shipment.
   *
   * Returns { id, exportDeclaration, invoiceNum, boxes, datePacked, receiptURL, receiptDate }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const shipmentRes = await db.query(
      `SELECT s.id,
              s.export_declaration AS "exportDeclaration",
              s.invoice_num AS "invoiceNum",
              s.boxes,
              s.date_packed AS "datePacked",
              s.receipt_url AS "receiptURL",
              s.receipt_date AS "receiptDate",
              s.library_id AS "libraryId",
              l.lib_name AS "libraryName"
        FROM shipments s
        LEFT JOIN libraries AS l ON l.id = s.library_id
        WHERE s.id = $1`,
      [id]
    );

    const shipment = shipmentRes.rows[0];

    if (!shipment) throw new NotFoundError(`No shipment with id: ${id}`);

    const datePacked = new Date(`${shipment.datePacked}`);
    let receiptDate;
    if (shipment.receiptDate) {
      receiptDate = new Date(`${shipment.receiptDate}`);
      receiptDate = receiptDate.toLocaleDateString();
    }

    return {
      ...shipment,
      datePacked: datePacked.toLocaleDateString(),
      receiptDate: receiptDate || null,
    };
  }

  /** Given a library id, return all shipment data for the library.
   *
   * Returns [{ exportDeclaration, invoiceNum, boxes, datePacked, receiptURL, receiptDate },...]
   *
   * Throws NotFoundError if not found.
   **/

  static async getLibraryShipments(libraryId) {
    const shipmentsRes = await db.query(
      `SELECT id,
              export_declaration AS "exportDeclaration",
              invoice_num AS "invoiceNum",
              boxes,
              date_packed AS "datePacked",
              receipt_url AS "receiptURL",
              receipt_date AS "receiptDate"
        FROM shipments
        WHERE library_id = $1
        ORDER BY date_packed DESC`,
      [libraryId]
    );

    const shipments = shipmentsRes.rows;

    if (!shipments.length)
      throw new NotFoundError(
        `No records found for library with id: ${libraryId}`
      );

    const mappedShipments = shipments.map((s) => {
      const datePacked = new Date(`${s.datePacked}`);
      let receiptDate;
      if (s.receiptDate) {
        receiptDate = new Date(`${s.receiptDate}`);
        receiptDate = receiptDate.toLocaleDateString();
      }
      return {
        ...s,
        datePacked: datePacked.toLocaleDateString(),
        receiptDate: receiptDate || null,
      };
    });

    return mappedShipments;
  }

  /** Update shipment data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data CAN include: {exportDeclaration, invoiceNum, boxes, datePacked, receiptURL, receiptDate}
   *
   * Returns {exportDeclaration, invoiceNum, boxes, datePacked, receiptURL, receiptDate}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const checkExistsRes = await db.query(
      `SELECT id
        FROM shipments
        WHERE id = $1`,
      [id]
    );
    const checkExists = checkExistsRes.rows[0];
    if (!checkExists) throw new NotFoundError(`No shipment with id: ${id}`);
    if (Object.keys(data).length === 0) throw new BadRequestError("No data");

    const { setCols, values } = sqlForPartialUpdate(data, {
      exportDeclaration: "export_declaration",
      invoiceNum: "invoice_num",
      datePacked: "date_packed",
      receiptURL: "receipt_url",
      receiptDate: "receipt_date",
    });
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE shipments
                          SET ${setCols}
                          WHERE id = ${handleVarIdx}
                          RETURNING export_declaration AS "exportDeclaration",
                                    invoice_num AS "invoiceNum",
                                    boxes,
                                    date_packed AS "datePacked",
                                    receipt_url AS "receiptURL",
                                    receipt_date AS "receiptDate"`;
    const result = await db.query(querySql, [...values, id]);
    data = result.rows[0];
    const datePacked = new Date(`${data.datePacked}`);
    let receiptDate;
    if (data.receiptDate) {
      receiptDate = new Date(`${data.receiptDate}`);
      receiptDate = receiptDate.toLocaleDateString();
    }

    return {
      ...data,
      receiptDate: receiptDate || null,
      datePacked: datePacked.toLocaleDateString(),
    };
  }

  /** Find all shipments.
   *
   * Returns [{ exportDeclaration, invoiceNum, boxes, datePacked, receiptURL, receiptDate }, ...]
   * */

  static async findAll() {
    let shipmentsRes = await db.query(`
    SELECT s.id,
            s.export_declaration AS "exportDeclaration",
            s.invoice_num AS "invoiceNum",
            s.boxes,
            s.date_packed AS "datePacked",
            s.receipt_url AS "receiptURL",
            s.receipt_date AS "receiptDate",
            s.library_id AS "libraryId",
            l.lib_name AS "libraryName"
    FROM shipments s
    LEFT JOIN libraries AS l ON l.id = s.library_id
    ORDER BY date_packed DESC`);
    const shipments = shipmentsRes.rows;
    const mappedShipments = shipments.map((s) => {
      const datePacked = new Date(`${s.datePacked}`);
      let receiptDate;
      if (s.receiptDate) {
        receiptDate = new Date(`${s.receiptDate}`);
        receiptDate = receiptDate.toLocaleDateString();
      }
      return {
        ...s,
        datePacked: datePacked.toLocaleDateString(),
        receiptDate: receiptDate || null,
      };
    });
    return mappedShipments;
  }

  /** Delete given shipment from database; returns undefined.
   *
   * Throws NotFoundError if shipment not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM shipments
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const shipment = result.rows[0];

    if (!shipment) throw new NotFoundError(`No shipment with id: ${id}`);
  }
}

module.exports = Shipment;
