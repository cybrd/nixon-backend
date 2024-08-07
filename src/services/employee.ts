import { MongoClient } from "mongodb";

import { Employee } from "../models/employee";

export const getEmployees = (
  client: MongoClient,
  options = { limit: 25, page: 0 }
) => {
  console.log("getEmployees");

  const collection = client.db("nixon").collection<Employee>("employee");

  return collection
    .find({})
    .skip(options.page * options.limit)
    .limit(options.limit)
    .toArray();
};

export const getEmployeesCount = (client: MongoClient) => {
  console.log("getEmployees");

  const collection = client.db("nixon").collection<Employee>("employee");

  return collection.countDocuments({});
};
