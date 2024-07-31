import assert from "assert";

import { mongoClient } from "../../src/connections";

import { getUserByUsernameAndPassword } from "../../src/services/user";

describe("service user", () => {
  describe("getUserByUsernameAndPassword", () => {
    it("works success", async () => {
      const result = await getUserByUsernameAndPassword(
        mongoClient,
        "joy",
        "joy"
      );

      assert.ok(result);
    });

    it("works fail", async () => {
      const result = await getUserByUsernameAndPassword(
        mongoClient,
        "joy1",
        "joy2"
      );

      assert.strictEqual(result, null);
    });
  });
});
