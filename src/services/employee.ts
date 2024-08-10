import { MongoClient } from "mongodb";

import { Employee } from "../models/employee";

export const getEmployees = (
  client: MongoClient,
  options = { limit: 25, page: 0 },
  filter = {}
) => {
  console.log("getEmployees", filter);

  const collection = client.db("nixon").collection<Employee>("employee");

  return collection
    .find(filter)
    .skip(options.page * options.limit)
    .limit(options.limit)
    .toArray();
};

export const getEmployeeByFingerPrintId = (
  client: MongoClient,
  fingerPrintId: string
) => {
  console.log("getEmployeeByFingerPrintId", fingerPrintId);

  const collection = client.db("nixon").collection<Employee>("employee");

  return collection.findOne({ fingerPrintId });
};

export const getEmployeesCount = (client: MongoClient, filter = {}) => {
  console.log("getEmployeesCount", filter);

  const collection = client.db("nixon").collection<Employee>("employee");

  return collection.countDocuments(filter);
};
