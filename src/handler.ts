import express, { json, urlencoded } from "express";
import { StatusCodes } from "http-status-codes";
import cors from "cors";
import serverless from "serverless-http";

import { testController } from "./controllers/test";
import { userController } from "./controllers/user";

const app = express();

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.use("/user", userController);
app.use("/test", testController);

app.use((req, res) =>
  res.status(StatusCodes.NOT_FOUND).json({
    error: "Not Found",
  })
);

export const index = serverless(app);
