import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { mongoClient } from "../connections";

import { authUser } from "../middlewares/auth";
import { getEmployees } from "../services/employee";

export const employeeController = Router();

employeeController.get("/", authUser("supervisor"), (req, res) => {
  (async () => {
    const result = await getEmployees(mongoClient);

    res.send(result);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});
