import assert from "assert";
import { connectMongodb } from "../../src/connections";
import { authUser } from "../../src/services/user";

describe("service user", () => {
  before(async () => {
    await connectMongodb();
  });

  describe("authUser", () => {
    it("works success", async () => {
      const result = await authUser("joy", "joy");

      assert.ok(result);
    });

    it("works fail", async () => {
      const result = await authUser("joy1", "joy2");

      assert.strictEqual(result, null);
    });
  });
});
