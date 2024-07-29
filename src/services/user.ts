import { connectMongodb } from "../connections";
import { User } from "../models/user";

export const authUser = async (username: string, password: string) => {
  console.log("authUser", username);

  const client = await connectMongodb();

  const collection = client.db("nixon").collection<User>("user");

  return collection.findOne({
    username,
    password,
  });
};
