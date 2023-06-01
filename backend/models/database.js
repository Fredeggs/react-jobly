"use strict";

const db = require("../db");

/** Related functions for companies. */

class Database {
  /** Get names and ids for provinces and regions
   *
   **/

  static async getRegionsAndProvinces() {
    const regionsRes = await db.query(
      `SELECT id, name
           FROM regions`,
      []
    );
    const regions = regionsRes.rows;

    const provincesRes = await db.query(
      `SELECT id, name
           FROM provinces`,
      []
    );
    const provinces = provincesRes.rows;

    return { regions, provinces };
  }
}

module.exports = Database;
