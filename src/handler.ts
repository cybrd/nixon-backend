import serverless from "serverless-http";
import express, { json, urlencoded } from "express";
import cors from "cors";

import { connectMongodb } from "./connections";
import { userController } from "./controllers/user";

const app = express();

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

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
