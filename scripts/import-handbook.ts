import { parse } from "csv-parse";
import { readFile } from "fs/promises";

import { mongoClient } from "../src/connections";

import { createHandbook } from "../src/services/handbook";

const main = async () => {
  const file = await readFile(`${__dirname}/handbook.csv`);
  const csv = parse(file, { columns: true });

  for await (const record of csv) {
    await createHandbook(mongoClient, record);
  }
};

main().catch(console.error);
