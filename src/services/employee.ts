import { MongoClient } from "mongodb";

import { Employee } from "../models/employee";

export const getEmployees = (
  client: MongoClient,
  options = { limit: 25, page: 0 },
  filter = {}
) => {
  console.log("getEmployees");

  const collection = client.db("nixon").collection<Employee>("employee");

  return collection
    .find(filter)
    .skip(options.page * options.limit)
    .limit(options.limit)
    .toArray();
};

export const getEmployeesCount = (client: MongoClient, filter = {}) => {
  console.log("getEmployees");

  const collection = client.db("nixon").collection<Employee>("employee");

  return collection.countDocuments(filter);
};
