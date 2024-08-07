import { StatusCodes } from "http-status-codes";
import assert from "assert";
import request from "supertest";

import { app } from "../../src/handler";

describe("controller handbook", () => {
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

  describe("route /handbook", () => {
    it("login fail", async () => {
      const result = await request(app).get("/handbook").send();

      assert.equal(result.statusCode, StatusCodes.UNAUTHORIZED);
    });

    it("works 200", async () => {
      const result = await request(app)
        .get("/handbook")
        .auth(token, { type: "bearer" })
        .send();

      assert.equal(result.statusCode, StatusCodes.OK);
    });
  });
});
