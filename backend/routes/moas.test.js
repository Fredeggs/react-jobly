// "use strict";

// const request = require("supertest");

// const app = require("../app");

// const {
//   commonBeforeAll,
//   commonBeforeEach,
//   commonAfterEach,
//   commonAfterAll,
//   testUserIds,
//   testLibraryIds,
//   tokens,
// } = require("./_testCommon");

// beforeAll(commonBeforeAll);
// beforeEach(commonBeforeEach);
// afterEach(commonAfterEach);
// afterAll(commonAfterAll);

// /************************************** POST /moas */

// describe("POST /moas/:libraryId", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//       .post(`/moas/${testLibraryIds[2]}`)
//       .send(newMOA)
//       .set("authorization", `Bearer ${tokens.adminToken}`);
//     expect(resp.statusCode).toEqual(201);
//     expect(resp.body).toEqual({
//       moa: {
//         id: expect.any(Number),
//         link: "https://developer.mozilla.org/",
//         moaStatus: "submitted",
//         libraryId: testLibraryIds[2],
//       },
//     });
//   });

//   test("works for correct user", async function () {
//     const resp = await request(app)
//       .post(`/moas/${testLibraryIds[3]}`)
//       .send(newMOA)
//       .set("authorization", `Bearer ${tokens.u3Token}`);
//     expect(resp.statusCode).toEqual(201);
//     expect(resp.body).toEqual({
//       moa: {
//         id: expect.any(Number),
//         link: "https://developer.mozilla.org/",
//         moaStatus: "submitted",
//         libraryId: testLibraryIds[3],
//       },
//     });
//   });

//   test("unauth for incorrect user", async function () {
//     const resp = await request(app)
//       .post(`/moas/${testLibraryIds[3]}`)
//       .send(newMOA)
//       .set("authorization", `Bearer ${tokens.u1Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//       .post(`/moas/${testLibraryIds[3]}`)
//       .send(newMOA);
//     expect(resp.statusCode).toEqual(401);
//   });
// });

// /************************************** PATCH /moas/:libraryId */

// describe("PATCH /moas/:libraryId", () => {
//   test("works for admins", async function () {
//     const resp = await request(app)
//       .patch(`/moas/${testLibraryIds[0]}`)
//       .send({
//         link: "updated link",
//         moaStatus: "approved",
//       })
//       .set("authorization", `Bearer ${tokens.adminToken}`);
//     expect(resp.body).toEqual({
//       moa: {
//         id: expect.any(Number),
//         link: "updated link",
//         moaStatus: "approved",
//         libraryId: testLibraryIds[0],
//       },
//     });
//   });

//   test("works for partial update", async function () {
//     const resp = await request(app)
//       .patch(`/moas/${testLibraryIds[0]}`)
//       .send({
//         moaStatus: "rejected",
//       })
//       .set("authorization", `Bearer ${tokens.adminToken}`);
//     expect(resp.body).toEqual({
//       moa: {
//         id: expect.any(Number),
//         link: "testLink1",
//         moaStatus: "rejected",
//         libraryId: testLibraryIds[0],
//       },
//     });
//   });

//   test("works for correct user", async function () {
//     const resp = await request(app)
//       .patch(`/moas/${testLibraryIds[0]}`)
//       .send({
//         link: "updated link",
//         moaStatus: "approved",
//       })
//       .set("authorization", `Bearer ${tokens.u1Token}`);
//     expect(resp.body).toEqual({
//       moa: {
//         id: expect.any(Number),
//         link: "updated link",
//         moaStatus: "approved",
//         libraryId: testLibraryIds[0],
//       },
//     });
//   });

//   test("unauth for incorrect user", async function () {
//     const resp = await request(app)
//       .patch(`/moas/${testLibraryIds[0]}`)
//       .send({
//         link: "updated link",
//         moaStatus: "approved",
//       })
//       .set("authorization", `Bearer ${tokens.u2Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app).patch(`/moas/${testLibraryIds[0]}`).send({
//       link: "updated link",
//       moaStatus: "approved",
//     });
//     expect(resp.statusCode).toEqual(401);
//   });
// });
