import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { ONE } from "../constants";
import { mongoClient } from "../connections";

import { getEmployees, getEmployeesCount } from "../services/employee";
import { authUser } from "../middlewares/auth";
import { objectRemoveEmpty } from "../helper/object-remove-empty";

export const employeeController = Router();

employeeController.get("/", authUser("supervisor"), (req, res) => {
  (async () => {
    const { page, ...filters } = req.query as { [k: string]: string };

    let pageOption = 0;
    if (page) {
      pageOption = Number(page) - ONE;
    }

    const [data, counts] = await Promise.all([
      getEmployees(
        mongoClient,
        { limit: 25, page: pageOption },
        objectRemoveEmpty(filters)
      ),
      getEmployeesCount(mongoClient, objectRemoveEmpty(filters)),
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
