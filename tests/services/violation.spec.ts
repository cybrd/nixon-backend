import assert from "assert";

import { mongoClient } from "../../src/connections";

import { getViolation, getViolationCount } from "../../src/services/violation";

describe("service violation", () => {
  describe("getViolation", () => {
    it("works success", async () => {
      const result = await getViolation(mongoClient);

      assert.ok(result);
    });
  });

  describe("getViolationCount", () => {
    it("works success", async () => {
      const result = await getViolationCount(mongoClient);

      assert.ok(result);
    });
  });
});
