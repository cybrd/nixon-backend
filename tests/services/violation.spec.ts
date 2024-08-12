import assert from "assert";

import { mongoClient } from "../../src/connections";

import {
  deleteViolation,
  getViolation,
  getViolationCount,
} from "../../src/services/violation";

describe("service violation", () => {
  describe("getViolation", () => {
    it.only("works", async () => {
      const result = await getViolation(mongoClient, { limit: 9999, page: 0 });

      assert.ok(result);
    });
  });

  describe("getViolationCount", () => {
    it("works", async () => {
      const result = await getViolationCount(mongoClient);

      assert.ok(result);
    });
  });

  describe("deleteViolation", () => {
    it("works", async () => {
      const result = await deleteViolation(
        mongoClient,
        "66b75814ea57098b23765820"
      );

      assert.ok(result);
    });
  });
});
