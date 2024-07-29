import serverless from "serverless-http";
import express, { json, urlencoded } from "express";
import cors from "cors";

import { userController } from "./controllers/user";

const app = express();

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.use("/user", userController);

app.use((req, res) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

export const index = serverless(app);
