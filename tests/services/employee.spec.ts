import assert from "assert";

import { mongoClient } from "../../src/connections";

import { getEmployees, getEmployeesCount } from "../../src/services/employee";

describe("service employee", () => {
  describe("getEmployees", () => {
    it("works success", async () => {
      const result = await getEmployees(mongoClient);

      assert.ok(result);
    });
  });

  describe("getEmployeesCount", () => {
    it("works success", async () => {
      const result = await getEmployeesCount(mongoClient);

      assert.ok(result);
    });
  });
});
