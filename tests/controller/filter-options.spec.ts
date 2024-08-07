import { StatusCodes } from "http-status-codes";
import assert from "assert";
import request from "supertest";

import { app } from "../../src/handler";

describe("controller filterOptions", () => {
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

  describe("route /filterOptions", () => {
    it("login fail", async () => {
      const result = await request(app).get("/filterOptions").send();

      assert.equal(result.statusCode, StatusCodes.UNAUTHORIZED);
    });

    it("works 200", async () => {
      const result = await request(app)
        .get("/filterOptions")
        .auth(token, { type: "bearer" })
        .send();

      assert.equal(result.statusCode, StatusCodes.OK);
    });
  });
});
