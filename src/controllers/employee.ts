import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { mongoClient } from "../connections";

import { getEmployees, getEmployeesCount } from "../services/employee";
import { authUser } from "../middlewares/auth";

export const employeeController = Router();

employeeController.get("/", authUser("supervisor"), (req, res) => {
  (async () => {
    const [data, counts] = await Promise.all([
      getEmployees(mongoClient),
      getEmployeesCount(mongoClient),
    ]);

    res.send({
      counts,
      data,
    });
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});
