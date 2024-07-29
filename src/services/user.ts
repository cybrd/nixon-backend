import { mongoClient } from "../connections";
import { User } from "../models/user";

export const authUser = (username: string, password: string) => {
  console.log("authUser", username);

  const collection = mongoClient.db("nixon").collection<User>("user");

  return collection.findOne({
    username,
    password,
  });
};
