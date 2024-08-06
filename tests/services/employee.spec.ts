import assert from "assert";

import { mongoClient } from "../../src/connections";

import { getEmployees } from "../../src/services/employee";

describe("service employee", () => {
  describe("getEmployees", () => {
    it("works success", async () => {
      const result = await getEmployees(mongoClient);

      console.log(result);

      assert.ok(result);
    });
  });
});
