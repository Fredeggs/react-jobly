"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for companies. */

class Library {
  /** Create a library (from data), update db, return new library data.
   *
   * data should be { admin_id, name, type, primary_address_id, shipping_address_id, classrooms, students, teachers, program }
   *
   * Returns { id, admin_id, name, type, primary_address_id, shipping_address_id, classrooms, students, teachers, program }
   *
   * Throws BadRequestError if library already in database.
   * */

  static async createLibrary({
    libraryData,
    primaryAddress,
    shippingAddress,
    contactData,
    adminId,
  }) {
    const duplicateLibCheck = await db.query(
      `SELECT lib_name
           FROM libraries
           WHERE lib_name = $1`,
      [libraryData.libraryName]
    );
    if (duplicateLibCheck.rows[0])
      throw new BadRequestError(
        `Duplicate library with name: ${libraryData.libraryName}`
      );

    const duplicateUserCheck = await db.query(
      `SELECT admin_id
           FROM libraries
           WHERE admin_id = $1`,
      [adminId]
    );
    if (duplicateUserCheck.rows[0])
      throw new BadRequestError(
        `User with id: ${adminId} is already associated with a library`
      );

    const shippingAddressRes = await db.query(
      `INSERT INTO shipping_addresses
           (street, barangay, city, province_id, region_id)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, street, barangay, city, province_id AS "provinceId", region_id AS "regionId"`,
      [
        shippingAddress.street,
        shippingAddress.barangay,
        shippingAddress.city,
        shippingAddress.provinceId,
        shippingAddress.regionId,
      ]
    );
    const newShippingAddress = shippingAddressRes.rows[0];

    const primaryAddressRes = await db.query(
      `INSERT INTO primary_addresses
           (street, barangay, city, province_id, region_id)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, street, barangay, city, province_id AS "provinceId", region_id AS "regionId"`,
      [
        primaryAddress.street,
        primaryAddress.barangay,
        primaryAddress.city,
        primaryAddress.provinceId,
        primaryAddress.regionId,
      ]
    );
    const newPrimaryAddress = primaryAddressRes.rows[0];

    const libraryRes = await db.query(
      `INSERT INTO libraries
           (admin_id, lib_name, lib_type, program, classrooms, teachers, students_per_grade, primary_address_id, shipping_address_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING id, admin_id as "adminId", lib_name AS "libraryName", lib_type AS "libraryType", program, classrooms, teachers, students_per_grade AS "studentsPerGrade"`,
      [
        adminId,
        libraryData.libraryName,
        libraryData.libraryType,
        libraryData.program,
        libraryData.classrooms,
        libraryData.teachers,
        libraryData.studentsPerGrade,
        newPrimaryAddress.id,
        newShippingAddress.id,
      ]
    );
    const newLibrary = libraryRes.rows[0];

    const newContact = await this.createContact({
      ...contactData,
      libraryId: newLibrary.id,
    });

    const library = {
      id: newLibrary.id,
      libraryData: {
        libraryName: newLibrary.libraryName,
        libraryType: newLibrary.libraryType,
        classrooms: newLibrary.classrooms,
        teachers: newLibrary.teachers,
        studentsPerGrade: newLibrary.studentsPerGrade,
        program: newLibrary.program,
      },
      primaryAddress: {
        ...newPrimaryAddress,
      },
      shippingAddress: {
        ...newShippingAddress,
      },
      contactData: {
        ...newContact,
      },
      adminId: newLibrary.adminId,
    };

    return library;
  }

  /** Create a contact for a library (from data), update db, return new contact data.
   *
   * data should be { firstName, lastName, email, phone, libraryId }
   *
   * Returns { id, firstName, lastName, email, phone, libraryId }
   * */
  static async createContact({ firstName, lastName, email, phone, libraryId }) {
    const duplicateCheck = await db.query(
      `SELECT email
           FROM contacts
           WHERE email = $1`,
      [email]
    );

    if (duplicateCheck.rows.length >= 1)
      throw new BadRequestError(`Duplicate contact with email: ${email}`);

    const newContactRes = await db.query(
      `INSERT INTO contacts
           (first_name, last_name, phone, email, library_id)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, first_name AS "firstName", last_name AS "lastName", phone, email, library_id AS "libraryId"`,
      [firstName, lastName, phone, email, libraryId]
    );
    const newContact = newContactRes.rows[0];
    return newContact;
  }

  /** Create a Memorandum of Agreement (moa) for a library (from data), update db, return new moa data.
   *
   * data should be { link, libraryId  }
   *
   * Returns {id, link, moaStatus, libraryId }
   * */
  static async createMOA({ link, libraryId }) {
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
           (moa_link, moa_status, library_id)
           VALUES ($1, 'submitted', $2)
           RETURNING id, moa_link AS "link", moa_status AS "moaStatus", library_id AS "libraryId"`,
      [link, libraryId]
    );
    const newMOA = newMOARes.rows[0];
    return newMOA;
  }

  /** Find all libraries (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - minEmployees
   * - maxEmployees
   * - name (will find case-insensitive, partial matches)
   *
   * Returns [{ handle, name, description, numEmployees, logoUrl }, ...]
   * */

  static async findAll(searchFilters = {}) {
    let query = `SELECT l.id,
                        l.admin_id AS "adminId",
                        l.lib_name AS "libraryName",
                        l.lib_type AS "libraryType",
                        prim.street AS "primaryStreet",
                        prim.barangay AS "primaryBarangay",
                        prim.city AS "primaryCity",
                        pprov.name AS "primaryProvince",
                        preg.name AS "primaryRegion",
                        ship.street AS "shippingStreet",
                        ship.barangay AS "shippingBarangay",
                        ship.city AS "shippingCity",
                        sprov.name AS "shippingProvince",
                        sreg.name AS "shippingRegion",
                        moas.moa_status AS "moaStatus"
                 FROM libraries l
                 LEFT JOIN primary_addresses AS prim ON prim.id = l.primary_address_id
                 LEFT JOIN shipping_addresses AS ship ON ship.id = l.shipping_address_id
                 LEFT JOIN provinces AS pprov ON pprov.id = prim.province_id
                 LEFT JOIN regions AS preg ON preg.id = prim.region_id
                 LEFT JOIN provinces AS sprov ON sprov.id = ship.province_id
                 LEFT JOIN regions AS sreg ON sreg.id = ship.region_id
                 LEFT JOIN moas ON moas.library_id = l.id`;
    let whereExpressions = [];
    let queryValues = [];
    const { name, submittedMOA } = searchFilters;

    if (name) {
      queryValues.push(`%${name}%`);
      whereExpressions.push(`lib_name ILIKE $${queryValues.length}`);
    }

    if (submittedMOA) {
      whereExpressions.push(`moas.moa_status = 'submitted'`);
    }

    if (whereExpressions.length > 0) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    // Finalize query and return results

    query += " ORDER BY lib_name";
    const librariesRes = await db.query(query, queryValues);
    return librariesRes.rows;
  }

  /** Given a library id, return data about library.
   *
   * Returns { id, admin, libraryData, contactData, primaryAddress, shippingAddress }
   *   where libraryData is { libraryName, libraryType, readingProgram, studentsPerGrade, classrooms, teachers }
   *   where admin is { firstName, lastName, email, phone }
   *   where contactData is { firstName, lastName, email, phone }
   *   where primaryAddress is { street, barangay, city, province, region }
   *   where shippingAddress is { street, barangay, city, province, region }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const libraryRes = await db.query(
      `SELECT id,
              admin_id,
              primary_address_id,
              shipping_address_id,
              lib_name,
              lib_type,
              classrooms,
              teachers,
              students_per_grade,
              program
        FROM libraries
        WHERE id = $1`,
      [id]
    );

    const library = libraryRes.rows[0];

    if (!library) throw new NotFoundError(`No library with id: ${id}`);

    const adminRes = await db.query(
      `SELECT id,
              first_name AS "firstName",
              last_name AS "lastName",
              email,
              phone
           FROM users
           WHERE id = $1`,
      [library.admin_id]
    );
    const admin = adminRes.rows[0];

    const contactRes = await db.query(
      `SELECT id,
              first_name AS "firstName",
              last_name AS "lastName",
              email,
              phone
           FROM contacts
           WHERE library_id = $1`,
      [library.id]
    );
    const contact = contactRes.rows[0];

    const moaRes = await db.query(
      `SELECT id,
              moa_link AS "link",
              moa_status AS "moaStatus"
           FROM moas
           WHERE library_id = $1`,
      [library.id]
    );
    const moa = moaRes.rows[0];

    const primaryAddressRes = await db.query(
      `SELECT a.id,
              a.street,
              a.barangay,
              a.city,
              p.name AS "province",
              r.name AS "region"
           FROM primary_addresses a
           LEFT JOIN provinces AS p ON p.id = a.province_id
           LEFT JOIN regions AS r ON r.id = a.region_id
           WHERE a.id = $1`,
      [library.primary_address_id]
    );
    const primaryAddress = primaryAddressRes.rows[0];

    const shippingAddressRes = await db.query(
      `SELECT a.id,
              a.street,
              a.barangay,
              a.city,
              p.name AS "province",
              r.name AS "region"
           FROM shipping_addresses a
           LEFT JOIN provinces AS p ON p.id = a.province_id
           LEFT JOIN regions AS r ON r.id = a.region_id
           WHERE a.id = $1`,
      [library.shipping_address_id]
    );
    const shippingAddress = shippingAddressRes.rows[0];

    return {
      id: library.id,
      libraryData: {
        libraryName: library.lib_name,
        libraryType: library.lib_type,
        program: library.program,
        classrooms: library.classrooms,
        teachers: library.teachers,
        studentsPerGrade: library.students_per_grade,
      },
      admin: { ...admin },
      contactData: { ...contact },
      moa: { ...moa },
      primaryAddress: { ...primaryAddress },
      shippingAddress: { ...shippingAddress },
    };
  }

  /** Update library data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {libraryDetails, primaryAddress, shippingAddress, contact}
   * where libraryDetails is { libraryName, libraryType, readingProgram, studentsPerGrade, teachers, classrooms }
   * where primaryAddress is { street, barangay, city, regionId, provinceId }
   * where shippingAddress is { street, barangay, city, regionId, provinceId }
   * where contact is { firstName, lastName, phone, email }
   *
   * Returns {libraryDetails, primaryAddress, shippingAddress, contact}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    if (Object.keys(data).length === 0) throw new BadRequestError("No data");
    const addressIdsRes = await db.query(
      `SELECT primary_address_id AS "primaryAddressId",
              shipping_address_id AS "shippingAddressId"
      FROM libraries
      WHERE id = $1`,
      [id]
    );
    const addressIds = addressIdsRes.rows[0];
    if (!addressIds) throw new NotFoundError(`No library with id: ${id}`);

    // update libraryData if provided, else return existing libraryData
    if (Object.keys(data.libraryData).length) {
      const { setCols, values } = sqlForPartialUpdate(data.libraryData, {
        libraryName: "lib_name",
        libraryType: "lib_type",
        studentsPerGrade: "students_per_grade",
      });
      const handleVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE libraries 
                        SET ${setCols} 
                        WHERE id = ${handleVarIdx} 
                        RETURNING lib_name AS "libraryName", 
                                  lib_type AS "libraryType", 
                                  program, 
                                  students_per_grade AS "studentsPerGrade", 
                                  teachers,
                                  classrooms`;
      const result = await db.query(querySql, [...values, id]);
      data.libraryData = result.rows[0];
    } else {
      const result = await db.query(
        `SELECT lib_name AS "libraryName", 
                lib_type AS "libraryType", 
                program, 
                students_per_grade AS "studentsPerGrade", 
                teachers,
                classrooms
        FROM libraries 
        WHERE id = $1`,
        [id]
      );
      data.libraryData = result.rows[0];
    }

    // update contactData if provided, else return existing contactData
    if (Object.keys(data.contactData).length) {
      const { setCols, values } = sqlForPartialUpdate(data.contactData, {
        firstName: "first_name",
        lastName: "last_name",
      });
      const handleVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE contacts 
                        SET ${setCols} 
                        WHERE library_id = ${handleVarIdx} 
                        RETURNING first_name AS "firstName", 
                                  last_name AS "lastName", 
                                  email,
                                  phone`;
      const contactRes = await db.query(querySql, [...values, id]);
      data.contactData = contactRes.rows[0];
    } else {
      const result = await db.query(
        `SELECT first_name AS "firstName", 
                last_name AS "lastName", 
                email,
                phone
        FROM contacts 
        WHERE library_id = $1`,
        [id]
      );
      data.contactData = result.rows[0];
    }

    // update primaryAddress if provided, else return existing primaryAddress
    if (Object.keys(data.primaryAddress).length) {
      const { setCols, values } = sqlForPartialUpdate(data.primaryAddress, {
        provinceId: "province_id",
        regionId: "region_id",
      });
      const handleVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE primary_addresses 
                        SET ${setCols} 
                        WHERE id = ${handleVarIdx} 
                        RETURNING street, 
                                  barangay, 
                                  city,
                                  province_id AS "province",
                                  region_id AS "region"`;
      const result = await db.query(querySql, [
        ...values,
        addressIds.primaryAddressId,
      ]);
      const provinceRes = await db.query(
        `SELECT name FROM provinces WHERE id = $1`,
        [result.rows[0].province]
      );
      const regionRes = await db.query(
        `SELECT name FROM regions WHERE id = $1`,
        [result.rows[0].region]
      );
      data.primaryAddress = {
        ...result.rows[0],
        province: provinceRes.rows[0].name,
        region: regionRes.rows[0].name,
      };
    } else {
      const result = await db.query(
        `SELECT street, 
                barangay, 
                city,
                province_id AS "province",
                region_id AS "region"
        FROM primary_addresses 
        WHERE id = $1`,
        [addressIds.primaryAddressId]
      );
      const provinceRes = await db.query(
        `SELECT name FROM provinces WHERE id = $1`,
        [result.rows[0].province]
      );
      const regionRes = await db.query(
        `SELECT name FROM regions WHERE id = $1`,
        [result.rows[0].region]
      );

      data.primaryAddress = {
        ...result.rows[0],
        province: provinceRes.rows[0].name,
        region: regionRes.rows[0].name,
      };
      delete data.primaryAddress.provinceId;
      delete data.primaryAddress.regionId;
    }

    // update shippingAddress if provided, else return existing shippingAddress
    if (Object.keys(data.shippingAddress).length) {
      const { setCols, values } = sqlForPartialUpdate(data.shippingAddress, {
        regionId: "region_id",
        provinceId: "province_id",
      });
      const handleVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE shipping_addresses 
                        SET ${setCols} 
                        WHERE id = ${handleVarIdx} 
                        RETURNING street, 
                                  barangay, 
                                  city,
                                  province_id AS "province",
                                  region_id AS "region"`;
      const result = await db.query(querySql, [
        ...values,
        addressIds.primaryAddressId,
      ]);
      const provinceRes = await db.query(
        `SELECT name FROM provinces WHERE id = $1`,
        [result.rows[0].province]
      );
      const regionRes = await db.query(
        `SELECT name FROM regions WHERE id = $1`,
        [result.rows[0].region]
      );
      data.shippingAddress = {
        ...result.rows[0],
        province: provinceRes.rows[0].name,
        region: regionRes.rows[0].name,
      };
    } else {
      const result = await db.query(
        `SELECT street, 
                barangay, 
                city,
                province_id AS "province",
                region_id AS "region"
        FROM shipping_addresses 
        WHERE id = $1`,
        [addressIds.shippingAddressId]
      );
      const provinceRes = await db.query(
        `SELECT name FROM provinces WHERE id = $1`,
        [result.rows[0].province]
      );
      const regionRes = await db.query(
        `SELECT name FROM regions WHERE id = $1`,
        [result.rows[0].region]
      );

      data.shippingAddress = {
        ...result.rows[0],
        province: provinceRes.rows[0].name,
        region: regionRes.rows[0].name,
      };
      delete data.shippingAddress.provinceId;
      delete data.shippingAddress.regionId;
    }

    return data;
  }

  /** Delete given library from database; returns undefined.
   *
   * Throws NotFoundError if library not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM libraries
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const library = result.rows[0];

    if (!library) throw new NotFoundError(`No library with id: ${id}`);
  }

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

module.exports = Library;
