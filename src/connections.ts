import { MongoClient } from "mongodb";
import { config } from "dotenv";
config();

export const mongoClient = new MongoClient(process.env.MONGODB_URI || "", {
  auth: {
    password: process.env.MONGODB_PASSWORD || "",
    username: process.env.MONGODB_USERNAME || "",
  },
});
