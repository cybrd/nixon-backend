import { MongoClient } from "mongodb";

import { Employee } from "../models/employee";

export const getEmployees = (
  client: MongoClient,
  options = { limit: 25, skip: 0 }
) => {
  console.log("getEmployees");

  const collection = client.db("nixon").collection<Employee>("employee");

  return collection
    .find({})
    .skip(options.skip * options.limit)
    .limit(options.limit)
    .toArray();
};
