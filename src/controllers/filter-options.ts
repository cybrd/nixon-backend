import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { mongoClient } from "../connections";

import { authUser } from "../middlewares/auth";
import { getEmployees } from "../services/employee";
import { getHandbook } from "../services/handbook";

export const filterOptionsController = Router();

filterOptionsController.get("/", authUser("supervisor"), (req, res) => {
  (async () => {
    const [employees, handbook] = await Promise.all([
      getEmployees(mongoClient, {
        limit: 99999,
        page: 0,
      }),
      getHandbook(mongoClient),
    ]);

    const filterOptions: Record<
      "department" | "fingerPrintId" | "handbook",
      Record<string, string>
    > = {
      department: {
        Basemix: "Basemix",
        Delivery: "Delivery",
        Grains: "Grains",
        Maintenance: "Maintenance",
        Office: "Office",
        "Packaging Materials": "Packaging Materials",
        "Plant 1": "Plant 1",
        "Plant 2": "Plant 2",
        "Plant 3": "Plant 3",
        "Plant 4": "Plant 4",
        "Plant 5": "Plant 5",
        "Plant 6": "Plant 6",
        Premix: "Premix",
        "Prepare Stocks": "Prepare Stocks",
        "R.O Water": "R.O Water",
        SILO: "SILO",
        Warehouse: "Warehouse",
      },
      fingerPrintId: {},
      handbook: {},
    };

    employees.forEach((employee) => {
      filterOptions.fingerPrintId[
        employee.fingerPrintId
      ] = `${employee.fingerPrintId} - ${employee.name}`;
    });

    handbook.forEach((x) => {
      filterOptions.handbook[
        `${x.under}-${x.violation}`
      ] = `${x.under}-${x.violation}: ${x.description}`;
    });

    res.json(filterOptions);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});
