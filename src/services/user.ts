import { MongoClient } from "mongodb";
import { User } from "../models/user";

export const getUserByUsernameAndPassword = (
  client: MongoClient,
  username: string,
  password: string
) => {
  console.log("getUserByUsernameAndPassword", username);

  const collection = client.db("nixon").collection<User>("user");

  return collection.findOne({
    password,
    username,
  });
};

export const getUserByUsername = (client: MongoClient, username: string) => {
  console.log("getUserByUsername", username);

  const collection = client.db("nixon").collection<User>("user");

  return collection.findOne({ username });
};
