import { MongoClient } from "mongodb";

import { Violation } from "../models/violation";

export const getViolation = (
  client: MongoClient,
  options = { limit: 25, page: 0 }
) => {
  console.log("getViolation");

  const collection = client.db("nixon").collection<Violation>("violation");

  return collection
    .find({})
    .skip(options.page * options.limit)
    .limit(options.limit)
    .toArray();
};

export const getViolationCount = (client: MongoClient) => {
  console.log("getViolationCount");

  const collection = client.db("nixon").collection<Violation>("violation");

  return collection.countDocuments({});
};

export const createViolation = (client: MongoClient, data: Violation) => {
  console.log("createViolation");

  const collection = client.db("nixon").collection<Violation>("violation");

  return collection.insertOne(data);
};
