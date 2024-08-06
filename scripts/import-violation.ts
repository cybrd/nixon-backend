import { parse } from "csv-parse";
import { readFile } from "fs/promises";

import { mongoClient } from "../src/connections";

import { createViolation } from "../src/services/violation";

const main = async () => {
  const file = await readFile(`${__dirname}/violation.csv`);
  const csv = parse(file, { columns: true });

  for await (const record of csv) {
    await createViolation(mongoClient, record);
  }

  process.exit();
};

main().catch(console.error);
