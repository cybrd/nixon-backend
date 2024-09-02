import { mongoClient } from "../src/connections";

import { Violation } from "../src/models/violation";

const main = async () => {
  const collection = mongoClient.db("nixon").collection<Violation>("violation");

  await collection.deleteMany();

  process.exit();
};

main().catch(console.error);
