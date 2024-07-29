import serverless from "serverless-http";
import express from "express";
import { connectMongodb } from "./connections";
import { userController } from "./controllers/user";

const app = express();

app.use(userController);

app.use((req, res) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const index = async () => {
  await connectMongodb();

  return serverless(app);
};
