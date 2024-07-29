import { MongoClient } from "mongodb";
import { config } from "dotenv";
config();

export const mongoClient = new MongoClient(process.env.MONGODB_URI || "");

export const connectMongodb = () => {
  console.log("connectMongodb");

  return mongoClient.connect();
};
