import express, { json, urlencoded } from "express";
import { StatusCodes } from "http-status-codes";
import cors from "cors";
import serverless from "serverless-http";

import { employeeController } from "./controllers/employee";
import { filterOptionsController } from "./controllers/filter-options";
import { handbookController } from "./controllers/handbook";
import { testController } from "./controllers/test";
import { userController } from "./controllers/user";
import { violationController } from "./controllers/violation";
import { violationSummaryController } from "./controllers/violation-summary";

export const app = express();

app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json({ limit: "50mb" }));

app.use("/employee", employeeController);
app.use("/filterOptions", filterOptionsController);
app.use("/handbook", handbookController);
app.use("/test", testController);
app.use("/user", userController);
app.use("/violation/summary", violationSummaryController);
app.use("/violation", violationController);

app.use((req, res) =>
  res.status(StatusCodes.NOT_FOUND).json({
    error: "Not Found",
  })
);

export const index = serverless(app);
