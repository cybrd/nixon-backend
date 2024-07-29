import assert from "assert";
import { MongoClient } from "mongodb";
import { connectMongodb } from "../../src/connections";
import { authUser } from "../../src/services/user";

describe("service user", () => {
  let client: MongoClient;

  before(async () => {
    client = await connectMongodb();
  });

  describe("authUser", () => {
    it("works success", async () => {
      const result = await authUser(client, "joy", "joy");

      assert.ok(result);
    });

    it("works fail", async () => {
      const result = await authUser(client, "joy1", "joy2");

      assert.strictEqual(result, null);
    });
  });
});
