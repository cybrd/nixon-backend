import { MongoClient } from "mongodb";

import { Handbook } from "../models/handbook";

export const getHandbook = (client: MongoClient) => {
  console.log("getHandbook");

  const collection = client.db("nixon").collection<Handbook>("handbook");

  return collection.find({}).toArray();
};

export const createHandbook = (client: MongoClient, data: Handbook) => {
  console.log("createHandbook");

  const collection = client.db("nixon").collection<Handbook>("handbook");

  return collection.insertOne(data);
};
