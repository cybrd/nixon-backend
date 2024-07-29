import { MongoClient } from "mongodb";
import { config } from "dotenv";
config();

export const mongoClient = new MongoClient(process.env.MONGODB_URI || "", {
  auth: {
    username: process.env.MONGODB_USERNAME || "",
    password: process.env.MONGODB_PASSWORD || "",
  },
});

export const connectMongodb = () => {
  console.log("connectMongodb");

  return mongoClient.connect();
};
