import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { ONE } from "../constants";
import { mongoClient } from "../connections";

import { getEmployees, getEmployeesCount } from "../services/employee";
import { authUser } from "../middlewares/auth";

export const employeeController = Router();

employeeController.get("/", authUser("supervisor"), (req, res) => {
  (async () => {
    const { page } = req.query;
    let pageOption = 0;
    if (page) {
      pageOption = Number(page) - ONE;
    }

    const [data, counts] = await Promise.all([
      getEmployees(mongoClient, { limit: 25, page: pageOption }),
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
