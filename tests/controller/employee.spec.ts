import { StatusCodes } from "http-status-codes";
import assert from "assert";
import request from "supertest";

import { app } from "../../src/handler";

describe("controller employee", () => {
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

  describe("route /employee", () => {
    it("login fail", async () => {
      const result = await request(app).get("/employee").send();

      assert.equal(result.statusCode, StatusCodes.UNAUTHORIZED);
    });

    it("works 200", async () => {
      const result = await request(app)
        .get("/employee")
        .auth(token, { type: "bearer" })
        .send();

      console.log(result.body);
      assert.equal(result.statusCode, StatusCodes.OK);
    });
  });
});
