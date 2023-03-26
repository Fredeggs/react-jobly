import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class JoblyApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${JoblyApi.token}` };
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
    console.log("getting token");
    let res = await this.request(`auth/token`, loginCredentials, "post");
    return res;
  }

  /** Get a token when entering correct login credentials  */
  static async register(signupCredentials) {
    console.log("getting token");
    let res = await this.request(`auth/register`, signupCredentials, "post");
    return res;
  }

  /** Get details on a company and a list of its jobs by handle. */
  static async getCompany(handle) {
    let res = await this.request(`companies/${handle}`);
    return res.company;
  }

  /** Get a list of companies. */
  static async getCompanies(searchTerm) {
    if (searchTerm) {
      let res = await this.request(`companies`, { name: searchTerm });
      return res.companies;
    }
    let res = await this.request(`companies`);
    return res.companies;
  }

  /** Get details on a job by handle. */
  static async getJob(handle) {
    let res = await this.request(`jobs/${handle}`);
    return res.job;
  }

  /** Get a list of jobs. */
  static async getJobs(searchTerm) {
    if (searchTerm) {
      let res = await this.request(`jobs`, { title: searchTerm });
      return res.jobs;
    }
    let res = await this.request(`jobs`);
    return res.jobs;
  }

  /** Get details on a user by handle. */
  static async getUser(handle) {
    let res = await this.request(`users/${handle}`);
    return res.user;
  }

  /** Update details for a specific user. */
  static async updateUser(handle, userData) {
    let res = await this.request(`users/${handle}`, userData, "patch");
    return res.user;
  }

  // obviously, you'll add a lot here ...
}

// for now, put token ("testuser" / "password" on class)
// JoblyApi.token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
//   "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
//   "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";

export default JoblyApi;
