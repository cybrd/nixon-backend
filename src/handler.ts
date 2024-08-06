import express, { json, urlencoded } from "express";
import { StatusCodes } from "http-status-codes";
import cors from "cors";
import serverless from "serverless-http";

import { employeeController } from "./controllers/employee";
import { handbookController } from "./controllers/handbook";
import { testController } from "./controllers/test";
import { userController } from "./controllers/user";

export const app = express();

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

app.use("/employee", employeeController);
app.use("/handbook", handbookController);
app.use("/user", userController);
app.use("/test", testController);

app.use((req, res) =>
  res.status(StatusCodes.NOT_FOUND).json({
    error: "Not Found",
  })
);

export const index = serverless(app);
