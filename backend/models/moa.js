"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for companies. */

class MOA {
  /** Create a Memorandum of Agreement (moa) for a library (from data), update db, return new moa data.
   *
   * data should be { libraryId  }
   *
   * Returns {id, moaStatus, libraryId }
   * */
  static async create(libraryId) {
    const duplicateCheck = await db.query(
      `SELECT id
           FROM moas
           WHERE library_id = $1`,
      [libraryId]
    );

    if (duplicateCheck.rows.length >= 1)
      throw new BadRequestError(`Duplicate moa with libraryId: ${libraryId}`);

    const newMOARes = await db.query(
      `INSERT INTO moas
           ( moa_status, library_id)
           VALUES ('submitted', $1)
           RETURNING id, moa_status AS "moaStatus", library_id AS "libraryId"`,
      [libraryId]
    );
    const newMOA = newMOARes.rows[0];
    return newMOA;
  }

  /** Update a Memorandum of Agreement (moa) for a library (from data), update db, return new moa data.
   *
   * data can be { link, moaStatus  }
   *
   * Returns {id, link, moaStatus, libraryId }
   * */
  static async update(libraryId, data) {
    const checkExistsRes = await db.query(
      `SELECT id
        FROM moas
        WHERE library_id = $1`,
      [libraryId]
    );
    const checkExists = checkExistsRes.rows[0];
    if (!checkExists)
      throw new NotFoundError(`No moa with libraryId: ${libraryId}`);
    if (Object.keys(data).length === 0) throw new BadRequestError("No data");

    const { setCols, values } = sqlForPartialUpdate(data, {
      moaStatus: "moa_status",
    });
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE moas
                          SET ${setCols}
                          WHERE library_id = ${handleVarIdx}
                          RETURNING id,
                                    moa_status AS "moaStatus",
                                    library_id AS "libraryId"`;
    const result = await db.query(querySql, [...values, libraryId]);
    data = result.rows[0];

    return data;
  }

  /** Get an moa from database based on its libraryId.
   *
   * Throws NotFoundError if moa not found.
   **/

  static async get(libraryId) {
    const result = await db.query(
      `SELECT id, moa_status, library_id
           FROM moas
           WHERE library_id = $1`,
      [libraryId]
    );
    const moa = result.rows[0];

    return moa;
  }

  /** Delete given moa from database based on its libraryId; returns undefined.
   *
   * Throws NotFoundError if moa not found.
   **/

  static async remove(libraryId) {
    const result = await db.query(
      `DELETE
           FROM moas
           WHERE library_id = $1
           RETURNING id`,
      [libraryId]
    );
    const moa = result.rows[0];

    if (!moa) throw new NotFoundError(`No moa with libraryId: ${libraryId}`);
  }

  /** Generate an moa based on the createLibrary data; returns undefined.
   *
   **/

  static async generateMOA(libraryData) {
    console.log(libraryData);
  }
}

module.exports = MOA;
