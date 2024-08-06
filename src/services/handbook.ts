import { MongoClient } from "mongodb";

import { Handbook } from "../models/handbook";

export const getHandbook = (
  client: MongoClient,
  options = { limit: 25, skip: 0 }
) => {
  console.log("getHandbook");

  const collection = client.db("nixon").collection<Handbook>("handbook");

  return collection
    .find({})
    .skip(options.skip * options.limit)
    .limit(options.limit)
    .toArray();
};

export const createHandbook = (client: MongoClient, data: Handbook) => {
  console.log("createHandbook");

  const collection = client.db("nixon").collection<Handbook>("handbook");

  return collection.insertOne(data);
};
