import assert from "assert";

import { mongoClient } from "../../src/connections";

import {
  deleteViolation,
  getViolation,
  getViolationById,
  getViolationCount,
  getViolationSummary,
  getViolationSummaryCount,
  recountByEmployee,
  createManyViolation,
} from "../../src/services/violation";

describe("service violation", () => {
  describe("getViolation", () => {
    it("works", async () => {
      const result = await getViolation(mongoClient, { limit: 9999, page: 0 });

      assert.ok(result);
    });
  });

  describe("getViolationById", () => {
    it("works", async () => {
      const result = await getViolationById(
        mongoClient,
        "66b25b3be7fb9aa1273f1fe4"
      );

      assert.ok(result);
    });
  });

  describe("getViolationCount", () => {
    it("works", async () => {
      const result = await getViolationCount(mongoClient);

      console.log(result);
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

  describe("getViolationSummary", () => {
    it("works", async () => {
      const result = await getViolationSummary(
        mongoClient,
        {
          limit: 9999,
          page: 0,
        },
        { employeeNumber: "10301" }
      );

      assert.ok(result);
    });
  });

  describe("getViolationSummaryCount", () => {
    it("works", async () => {
      const result = await getViolationSummaryCount(mongoClient, {
        employeeNumber: "10301",
      });

      assert.ok(result);
    });
  });

  describe("recountByEmployee", () => {
    it("works", async () => {
      const result = await recountByEmployee(mongoClient, "10301");

      assert.ok(result);
    });
  });

  describe.skip("createManyViolation", () => {
    it("works", async () => {
      const violation = await getViolation(mongoClient);
      const result = await createManyViolation(mongoClient, violation);

      assert.ok(result);
    });
  });
});
