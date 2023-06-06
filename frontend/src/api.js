import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class BKPApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${BKPApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get a token when entering correct login credentials  */
  static async getToken(loginCredentials) {
    let res = await this.request(`auth/token`, loginCredentials, "post");
    return res;
  }

  /** Get a token when entering correct login credentials  */
  static async register(signupCredentials) {
    let res = await this.request(`auth/register`, signupCredentials, "post");
    return res;
  }

  /** Create a library for a specific user. */
  static async createLibrary(libraryData) {
    let res = await this.request(`libraries/`, libraryData, "post");
    return res.user;
  }

  /** Get details on a library and a list of its shipments by handle. */
  static async getLibrary(id) {
    let res = await this.request(`libraries/${id}`);
    return res.library;
  }

  /** Get a list of libraries. */
  static async getLibraries(data = {}) {
    if (data.libraryName) {
      let res = await this.request(`libraries`, { name: data.libraryName });
      return res.libraries;
    }
    if (data.submittedMOA) {
      let res = await this.request(`libraries`, {
        submittedMOA: data.submittedMOA,
      });
      return res.libraries;
    }
    let res = await this.request(`libraries`);
    return res.libraries;
  }

  /** Get a list of names and ids for regions and provinces. */
  static async getRegionsAndProvinces() {
    let res = await this.request(`database/regions-and-provinces`);
    return res;
  }

  /** Get details on a user by email. */
  static async getUser(email) {
    let res = await this.request(`users/${email}`);
    return res.user;
  }

  /** Update details for a specific user. */
  static async updateUser(email, userData) {
    let res = await this.request(`users/${email}`, userData, "patch");
    return res.user;
  }

  // obviously, you'll add a lot here ...
}

// for now, put token ("testuser" / "password" on class)
// BKPApi.token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
//   "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
//   "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";

export default BKPApi;
