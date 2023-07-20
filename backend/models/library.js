"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for companies. */

class Library {
  /** Create a library (from data), update db, return new library data.
   *
   * data should be { libraryData, primaryAddress, USContact, PHContact, adminId }
   *
   * where libraryData is {}
   * where primaryAddress is {}
   * where USContact is {}
   *
   * Returns { id, admin_id, name, type, primary_address_id, classrooms, students, teachers, program }
   *
   * Throws BadRequestError if library already in database.
   * */

  static async createLibrary({
    libraryData,
    primaryAddress,
    USContact,
    PHContact,
    adminId,
    readingSpaces,
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
           (admin_id, lib_name, lib_type, program, classrooms, teachers, students_per_grade, primary_address_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
      ]
    );
    const newLibrary = libraryRes.rows[0];

    const newReadingSpaces = await Promise.all(
      readingSpaces.map(async (space) => {
        const res = await db.query(
          `INSERT INTO reading_spaces
             (reading_space, library_id)
             VALUES ($1, $2)
             RETURNING reading_space`,
          [space, newLibrary.id]
        );
        return res.rows[0].reading_space;
      })
    );

    const newUSContact = await this.createContact({
      ...USContact,
      contactType: "us-sponsor",
      libraryId: newLibrary.id,
    });

    const newPHContact = await this.createContact({
      ...PHContact,
      contactType: "ph-sponsor",
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
      USContact: {
        ...newUSContact,
      },
      PHContact: {
        ...newPHContact,
      },
      adminId: newLibrary.adminId,
      readingSpaces: newReadingSpaces,
    };

    return library;
  }

  /** Create a contact for a library (from data), return new contact data.
   *
   * data should be { firstName, lastName, email, phone, libraryId, contactType }
   *
   * Returns { id, firstName, lastName, email, phone, libraryId, contactType }
   * */
  static async createContact({
    firstName,
    lastName,
    email,
    phone,
    libraryId,
    contactType,
  }) {
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
           (first_name, last_name, phone, email, library_id, contact_type)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, first_name AS "firstName", last_name AS "lastName", phone, email, library_id AS "libraryId", contact_type AS "contactType"`,
      [firstName, lastName, phone, email, libraryId, contactType]
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
                        moas.moa_status AS "moaStatus"
                 FROM libraries l
                 LEFT JOIN primary_addresses AS prim ON prim.id = l.primary_address_id
                 LEFT JOIN provinces AS pprov ON pprov.id = prim.province_id
                 LEFT JOIN regions AS preg ON preg.id = prim.region_id
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
   *   where USContact is { firstName, lastName, email, phone, contactType }
   *   where PHContact is { firstName, lastName, email, phone, contactType }
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

    const readingSpacesRes = await db.query(
      `SELECT reading_space
        FROM reading_spaces
        WHERE library_id = $1`,
      [id]
    );
    const readingSpaces = readingSpacesRes.rows.map(
      (elem) => elem.reading_space
    );

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

    const USContactRes = await db.query(
      `SELECT id,
              first_name AS "firstName",
              last_name AS "lastName",
              email,
              phone
           FROM contacts
           WHERE library_id = $1 AND contact_type = 'us-sponsor'`,
      [library.id]
    );
    const USContact = USContactRes.rows[0];

    const PHContactRes = await db.query(
      `SELECT id,
              first_name AS "firstName",
              last_name AS "lastName",
              email,
              phone
           FROM contacts
           WHERE library_id = $1 AND contact_type = 'ph-sponsor'`,
      [library.id]
    );
    const PHContact = PHContactRes.rows[0];

    const moaRes = await db.query(
      `SELECT id,
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
      readingSpaces: readingSpaces,
      admin: { ...admin },
      USContact: { ...USContact },
      PHContact: { ...PHContact },
      moa: { ...moa },
      primaryAddress: { ...primaryAddress },
    };
  }

  /** Update library data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {libraryDetails, primaryAddress, shippingAddress, contact}
   * where libraryDetails is { libraryName, libraryType, readingProgram, studentsPerGrade, teachers, classrooms, readingSpaces }
   * where primaryAddress is { street, barangay, city, regionId, provinceId }
   * where USContact is { firstName, lastName, phone, email }
   * where PHContact is { firstName, lastName, phone, email }
   *
   * Returns {libraryDetails, primaryAddress, shippingAddress, contact}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    if (Object.keys(data).length === 0) throw new BadRequestError("No data");
    const addressIdsRes = await db.query(
      `SELECT primary_address_id AS "primaryAddressId"
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

    // update readingSpaces if provided, else return existing readingSpaces
    if (data.readingSpaces) {
      await db.query(
        `DELETE
             FROM reading_spaces
             WHERE library_id = $1`,
        [id]
      );

      if (data.readingSpaces.length) {
        const updatedReadingSpaces = await Promise.all(
          data.readingSpaces.map(async (space) => {
            const res = await db.query(
              `INSERT INTO reading_spaces
                 (reading_space, library_id)
                 VALUES ($1, $2)
                 RETURNING reading_space`,
              [space, id]
            );
            return res.rows[0].reading_space;
          })
        );

        data.readingSpaces = updatedReadingSpaces;
      } else {
        data.readingSpaces = [];
      }
    } else {
      const readingSpacesRes = await db.query(
        `SELECT reading_space
          FROM reading_spaces
          WHERE library_id = $1`,
        [id]
      );
      const readingSpaces = readingSpacesRes.rows.map(
        (elem) => elem.reading_space
      );

      data.readingSpaces = readingSpaces;
    }

    // update USContact if provided, else return existing USContact data
    if (Object.keys(data.USContact).length) {
      const { setCols, values } = sqlForPartialUpdate(data.USContact, {
        firstName: "first_name",
        lastName: "last_name",
      });
      const handleVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE contacts 
                        SET ${setCols} 
                        WHERE library_id = ${handleVarIdx} AND contact_type = 'us-sponsor'
                        RETURNING first_name AS "firstName", 
                                  last_name AS "lastName", 
                                  email,
                                  phone`;
      const USContactRes = await db.query(querySql, [...values, id]);
      data.USContact = USContactRes.rows[0];
    } else {
      const result = await db.query(
        `SELECT first_name AS "firstName", 
                last_name AS "lastName", 
                email,
                phone
        FROM contacts 
        WHERE library_id = $1 AND contact_type = 'us-sponsor'`,
        [id]
      );
      data.USContact = result.rows[0];
    }

    // update PHContact if provided, else return existing PHContact data
    if (Object.keys(data.PHContact).length) {
      const { setCols, values } = sqlForPartialUpdate(data.PHContact, {
        firstName: "first_name",
        lastName: "last_name",
      });
      const handleVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE contacts 
                        SET ${setCols} 
                        WHERE library_id = ${handleVarIdx} AND contact_type = 'ph-sponsor'
                        RETURNING first_name AS "firstName", 
                                  last_name AS "lastName", 
                                  email,
                                  phone`;
      const PHContactRes = await db.query(querySql, [...values, id]);
      data.PHContact = PHContactRes.rows[0];
    } else {
      const result = await db.query(
        `SELECT first_name AS "firstName", 
                last_name AS "lastName", 
                email,
                phone
        FROM contacts 
        WHERE library_id = $1 AND contact_type = 'ph-sponsor'`,
        [id]
      );
      data.PHContact = result.rows[0];
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
