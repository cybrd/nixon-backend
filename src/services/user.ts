import { MongoClient } from "mongodb";
import { User } from "../models/user";

export const authUser = async (
  client: MongoClient,
  username: string,
  password: string
) => {
  console.log("authUser", username);

  const collection = client.db("nixon").collection<User>("user");

  return collection.findOne({
    username,
    password,
  });
};
