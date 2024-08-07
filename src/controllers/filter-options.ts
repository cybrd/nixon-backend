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

    const filterOptions: Record<string, Record<string, string>> = {
      department: {},
      fingerPrintId: {},
    };

    employees.forEach((employee) => {
      filterOptions.department[employee.department] = employee.department;
      filterOptions.fingerPrintId[
        employee.fingerPrintId
      ] = `${employee.fingerPrintId} - ${employee.name}`;
    });

    res.send(filterOptions);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});
