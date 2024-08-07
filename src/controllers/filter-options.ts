import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { mongoClient } from "../connections";

import { authUser } from "../middlewares/auth";
import { getEmployees } from "../services/employee";

export const filterOptionsController = Router();

filterOptionsController.get("/", authUser("supervisor"), (req, res) => {
  (async () => {
    const employees = await getEmployees(mongoClient, {
      limit: 99999,
      page: 0,
    });

    const filterOptionsSet = {
      department: new Set<string>(),
      fingerPrintId: new Set<string>(),
    };

    employees.forEach((employee) => {
      filterOptionsSet.department.add(employee.department);
      filterOptionsSet.fingerPrintId.add(employee.fingerPrintId);
    });

    const filterOptions = {
      department: Array.from(filterOptionsSet.department),
      fingerPrintId: Array.from(filterOptionsSet.fingerPrintId),
    };

    res.send(filterOptions);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});
