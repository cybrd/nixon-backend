import { StatusCodes } from "http-status-codes";
import assert from "assert";
import request from "supertest";

import { app } from "../../src/handler";

describe("controller violation", () => {
  let token = "";

  before((done) => {
    request(app)
      .post("/user/login")
      .send({
        password: process.env.TEST_PASS,
        username: process.env.TEST_USER,
      })
      .then((data) => {
        ({ token } = data.body as { token: string });

        done();
      })
      .catch(done);
  });

  describe("route /violation", () => {
    it("login fail", async () => {
      const result = await request(app).get("/violation").send();

      assert.equal(result.statusCode, StatusCodes.UNAUTHORIZED);
    });

    it("works 200", async () => {
      const result = await request(app)
        .get("/violation")
        .auth(token, { type: "bearer" })
        .send();

      assert.equal(result.statusCode, StatusCodes.OK);
    });
  });

  describe("route /violation/:id", () => {
    it("login fail", async () => {
      const result = await request(app)
        .get("/violation/66b25b3be7fb9aa1273f1fe4")
        .send();

      assert.equal(result.statusCode, StatusCodes.UNAUTHORIZED);
    });

    it("works 200", async () => {
      const result = await request(app)
        .get("/violation/66b25b3be7fb9aa1273f1fe4")
        .auth(token, { type: "bearer" })
        .send();

      assert.equal(result.statusCode, StatusCodes.OK);
    });
  });

  describe("route DELETE /violation", () => {
    it("login fail", async () => {
      const result = await request(app)
        .delete("/violation/66b75814ea57098b23765820")
        .send();

      assert.equal(result.statusCode, StatusCodes.UNAUTHORIZED);
    });

    it("works 200", async () => {
      const result = await request(app)
        .delete("/violation/66b75814ea57098b23765820")
        .auth(token, { type: "bearer" })
        .send();

      assert.equal(result.statusCode, StatusCodes.OK);
    });
  });

  describe("route PUT /violation/:id", () => {
    it("login fail", async () => {
      const result = await request(app)
        .put("/violation/66bb72ceba9d870feb4c1c69")
        .send();

      assert.equal(result.statusCode, StatusCodes.UNAUTHORIZED);
    });

    it("works 200", async () => {
      const result = await request(app)
        .put("/violation/66bb72ceba9d870feb4c1c69")
        .auth(token, { type: "bearer" })
        .send({
          controlNumber: "test",
          dateOfIncident: "2024-08-13",
          deptHead: "4",
          employeeNumber: "1",
          incidentDescription: "222",
          reportedBy: "5",
          timeOfIncident: "11:13",
          under: "Attendance-2",
        });

      assert.ok(result);
    });
  });
});
