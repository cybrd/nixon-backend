import { mongoClient } from "../src/connections";

import { Employee } from "../src/models/employee";

const main = async () => {
  const length = 4;
  const collection = mongoClient.db("nixon").collection<Employee>("employee");

  const result = await collection
    .find({ fingerPrintId: { $lte: "999" } })
    .toArray();

  for await (const record of result) {
    await collection.updateOne(
      { _id: record._id },
      { $set: { fingerPrintId: record.fingerPrintId.padStart(length, "0") } }
    );
  }

  process.exit();
};

main().catch(console.error);
