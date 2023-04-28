"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {
  /** authenticate user with username, password.
   *
   * Returns { id, first_name, last_name, email, is_admin }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(email, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT id,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { firstName, lastName, email, isAdmin }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({ password, firstName, lastName, email, isAdmin }) {
    const duplicateCheck = await db.query(
      `SELECT email
           FROM users
           WHERE email = $1`,
      [email]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate user with email: ${email}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
           (password,
            first_name,
            last_name,
            email,
            is_admin)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin"`,
      [hashedPassword, firstName, lastName, email, isAdmin]
    );

    const user = result.rows[0];

    return user;
  }

  /** Find all users.
   *
   * Returns [{ username, first_name, last_name, email, is_admin }, ...]
   **/

  static async findAll() {
    const result = await db.query(
      `SELECT id,
                  email,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  is_admin AS "isAdmin"
           FROM users
           ORDER BY id`
    );

    return result.rows;
  }

  /** Given an id, return data about user.
   *
   * Returns { id, first_name, last_name, is_admin, jobs }
   *   where jobs is { id, title, company_handle, company_name, state }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const userRes = await db.query(
      `SELECT id,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin"
           FROM users
           WHERE id = $1`,
      [id]
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user with id: ${id}`);

    // const userApplicationsRes = await db.query(
    //   `SELECT a.job_id
    //        FROM applications AS a
    //        WHERE a.username = $1`,
    //   [username]
    // );

    // user.applications = userApplicationsRes.rows.map((a) => a.job_id);
    return user;
  }

  /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, isAdmin }
   *
   * Returns { id, firstName, lastName, email, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

  static async update(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                is_admin AS "isAdmin"`;
    const result = await db.query(querySql, [...values, id]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user with id: ${id}`);

    delete user.password;
    return user;
  }

  /** Delete given user from database; returns undefined. */

  static async remove(id) {
    let result = await db.query(
      `DELETE
           FROM users
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user with id: ${id}`);
  }
}

module.exports = User;
