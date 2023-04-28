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
    libraryName,
    adminId,
    libraryType,
    primaryStreet,
    primaryBarangay,
    primaryCity,
    primaryProvinceId,
    primaryRegionId,
    shippingStreet,
    shippingBarangay,
    shippingCity,
    shippingProvinceId,
    shippingRegionId,
    classrooms = 0,
    studentsPerGrade = 0,
    teachers = 0,
    program,
    contactFirst,
    contactLast,
    contactPhone,
    contactEmail,
  }) {
    const duplicateCheck = await db.query(
      `SELECT lib_name
           FROM libraries
           WHERE lib_name = $1`,
      [libraryName]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate library with name: ${libraryName}`);

    const shippingAddressRes = await db.query(
      `INSERT INTO shipping_addresses
           (street, barangay, city, province_id, region_id)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING street AS "shippingStreet", barangay AS "shippingBarangay", city AS "shippingCity", province_id AS "shippingProvinceId", region_id AS "shippingRegionId"`,
      [
        shippingStreet,
        shippingBarangay,
        shippingCity,
        shippingProvinceId,
        shippingRegionId,
      ]
    );
    const shippingAddress = shippingAddressRes.rows[0];

    const primaryAddressRes = await db.query(
      `INSERT INTO primary_addresses
           (street, barangay, city, province_id, region_id)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING street AS "primaryStreet", barangay AS "primaryBarangay", city AS "primaryCity", province_id AS "primaryProvinceId", region_id AS "primaryRegionId"`,
      [
        primaryStreet,
        primaryBarangay,
        primaryCity,
        primaryProvinceId,
        primaryRegionId,
      ]
    );
    const primaryAddress = primaryAddressRes.rows[0];

    const libraryRes = await db.query(
      `INSERT INTO libraries
           (admin_id, lib_name, program, classrooms, teachers, students_per_grade, primary_address_id, shipping_address_id, lib_type)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING id, admin_id as "adminId", lib_name AS "libraryName", program, classrooms, teachers, students_per_grade AS "studentsPerGrade", lib_type AS "libraryType"`,
      [
        adminId,
        libraryName,
        program,
        classrooms,
        teachers,
        studentsPerGrade,
        primaryAddress.id,
        shippingAddress.id,
        libraryType,
      ]
    );

    const newContact = await this.createContact({
      contactFirst,
      contactLast,
      contactEmail,
      contactPhone,
      libraryId: libraryRes.rows[0].id,
    });

    const library = {
      ...libraryRes.rows[0],
      ...primaryAddress,
      ...shippingAddress,
      ...newContact,
    };

    return library;
  }

  /** Create a contact for a library (from data), update db, return new contact data.
   *
   * data should be { admin_id, name, type, primary_address_id, shipping_address_id, classrooms, students, teachers, program }
   *
   * Returns [{ handle, name, description, numEmployees, logoUrl }, ...]
   * */
  static async createContact({
    contactFirst,
    contactLast,
    contactEmail,
    contactPhone,
    libraryId,
  }) {
    const duplicateCheck = await db.query(
      `SELECT email
           FROM contacts
           WHERE email = $1`,
      [contactEmail]
    );

    if (duplicateCheck.rows.length >= 1)
      throw new BadRequestError(
        `Duplicate contact with email: ${contactEmail}`
      );

    const newContactRes = await db.query(
      `INSERT INTO contacts
           (first_name, last_name, phone, email, library_id)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, first_name AS "contactFirst", last_name AS "contactLast", phone AS "contactPhone", email AS "contactEmail", library_id AS "libraryId"`,
      [contactFirst, contactLast, contactPhone, contactEmail, libraryId]
    );
    const newContact = newContactRes.rows[0];
    return newContact;
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
                        sreg.name AS "shippingRegion"
                 FROM libraries l
                 LEFT JOIN primary_addresses AS prim ON prim.id = l.primary_address_id
                 LEFT JOIN shipping_addresses AS ship ON ship.id = l.shipping_address_id
                 LEFT JOIN provinces AS pprov ON pprov.id = prim.province_id
                 LEFT JOIN regions AS preg ON preg.id = prim.region_id
                 LEFT JOIN provinces AS sprov ON sprov.id = ship.province_id
                 LEFT JOIN regions AS sreg ON sreg.id = ship.region_id`;
    let whereExpressions = [];
    let queryValues = [];
    const { name } = searchFilters;

    if (name) {
      queryValues.push(`%${name}%`);
      whereExpressions.push(`lib_name ILIKE $${queryValues.length}`);
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
   * Returns { id, admin, contact, primaryAddress, shippingAddress }
   *   where libraryDetails is { libraryName, libraryType, readingProgram, studentsPerGrade, classrooms, teachers }
   *   where admin is { firstName, lastName, email, phone }
   *   where contact is { firstName, lastName, email, phone }
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
      libraryDetails: {
        libraryName: library.lib_name,
        libraryType: library.lib_type,
        readingProgram: library.program,
        classrooms: library.classrooms,
        teachers: library.teachers,
        studentsPerGrade: library.students_per_grade,
      },
      admin: { ...admin },
      contact: { ...contact },
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
   * where primaryAddress is { street, barangay, city, region, province }
   * where shippingAddress is { street, barangay, city, region, province }
   * where contact is { firstName, lastName, phone, email }
   *
   * Returns {libraryDetails, primaryAddress, shippingAddress, contact}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    if (Object.keys(data).length === 0) throw new BadRequestError("No data");
    const addressIdsRes = await db.query(
      `SELECT primary_address_id,
              shipping_address_id
      FROM libraries
      WHERE id = $1`,
      [id]
    );
    const addressIds = addressIdsRes.rows[0];
    if (!addressIds) throw new NotFoundError(`No library with id: ${id}`);

    if (Object.keys(data.libraryDetails).length) {
      const { setCols, values } = sqlForPartialUpdate(data.libraryDetails, {
        libraryName: "lib_name",
        libraryType: "lib_type",
        readingProgram: "program",
        studentsPerGrade: "students_per_grade",
      });
      const handleVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE libraries 
                        SET ${setCols} 
                        WHERE id = ${handleVarIdx} 
                        RETURNING lib_name AS "libraryName", 
                                  lib_type AS "libraryType", 
                                  program AS "readingProgram", 
                                  students_per_grade AS "studentsPerGrade", 
                                  teachers,
                                  classrooms`;
      const result = await db.query(querySql, [...values, id]);
      data.libraryDetails = result.rows[0];
    }
    if (Object.keys(data.contact).length) {
      const { setCols, values } = sqlForPartialUpdate(data.contact, {
        firstName: "first_name",
        lastName: "lastName",
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
      data.contact = contactRes.rows[0];
    }
    if (Object.keys(data.primaryAddress).length) {
      if (data.primaryAddress.province) {
        const provinceIdRes = await db.query(
          `SELECT id FROM provinces WHERE name = $1`,
          [data.primaryAddress.province]
        );
        const provinceId = provinceIdRes.rows[0];
        if (!provinceId)
          throw new NotFoundError(
            `No province with name: ${data.primaryAddress.province}`
          );
        data.primaryAddress.province = provinceId;
      }
      if (data.primaryAddress.region) {
        const regionIdRes = await db.query(
          `SELECT id FROM regions WHERE name = $1`,
          [data.primaryAddress.region]
        );
        const regionId = regionIdRes.rows[0];
        if (!regionId)
          throw new NotFoundError(
            `No region with name: ${data.primaryAddress.region}`
          );
        data.primaryAddress.region = regionId;
      }
      const { setCols, values } = sqlForPartialUpdate(data.primaryAddress, {});
      const handleVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE primary_addresses 
                        SET ${setCols} 
                        WHERE id = ${handleVarIdx} 
                        RETURNING street, 
                                  barangay, 
                                  city,
                                  province_id AS "province",
                                  region_id AS "region"`;
      const result = await db.query(querySql, [...values, id]);
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
        province: provinceRes.rows[0],
        region: regionRes.rows[0],
      };
    }
    if (Object.keys(data.shippingAddress).length) {
      if (data.shippingAddress.province) {
        const provinceIdRes = await db.query(
          `SELECT id FROM provinces WHERE name = $1`,
          [data.shippingAddress.province]
        );
        const provinceId = provinceIdRes.rows[0];
        if (!provinceId)
          throw new NotFoundError(
            `No province with name: ${data.shippingAddress.province}`
          );
        data.shippingAddress.province = provinceId;
      }
      if (data.shippingAddress.region) {
        const regionIdRes = await db.query(
          `SELECT id FROM regions WHERE name = $1`,
          [data.shippingAddress.region]
        );
        const regionId = regionIdRes.rows[0];
        if (!regionId)
          throw new NotFoundError(
            `No region with name: ${data.shippingAddress.region}`
          );
        data.shippingAddress.region = regionId;
      }
      const { setCols, values } = sqlForPartialUpdate(data.shippingAddress, {});
      const handleVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE shipping_addresses 
                        SET ${setCols} 
                        WHERE id = ${handleVarIdx} 
                        RETURNING street, 
                                  barangay, 
                                  city,
                                  province_id AS "province",
                                  region_id AS "region"`;
      const result = await db.query(querySql, [...values, id]);
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
        province: provinceRes.rows[0],
        region: regionRes.rows[0],
      };
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
}

module.exports = Library;
