import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { ONE } from "../constants";
import { mongoClient } from "../connections";

import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  getEmployeesCount,
  updateEmployee,
} from "../services/employee";
import { Employee } from "../models/employee";
import { authUser } from "../middlewares/auth";
import { objectRemoveEmpty } from "../helper/object-remove-empty";

export const employeeController = Router();

employeeController.get("/", authUser("supervisor"), (req, res) => {
  (async () => {
    const { page, ...filters } = req.query as Record<string, string>;
    const cleanFilter = objectRemoveEmpty(filters);

    let pageOption = 0;
    if (page) {
      pageOption = Number(page) - ONE;
    }

    const [data, counts] = await Promise.all([
      getEmployees(mongoClient, { limit: 25, page: pageOption }, cleanFilter),
      getEmployeesCount(mongoClient, cleanFilter),
    ]);

    res.json({
      counts,
      data,
    });
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

employeeController.get("/:id", authUser("supervisor"), (req, res) => {
  (async () => {
    const result = await getEmployeeById(mongoClient, req.params.id);

    res.send(result);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

employeeController.put("/:id", authUser("supervisor"), (req, res) => {
  (async () => {
    const body = req.body as Employee;

    const result = await updateEmployee(mongoClient, req.params.id, body);

    res.send(result);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

employeeController.post("/create", authUser("supervisor"), (req, res) => {
  (async () => {
    const body = req.body as Employee;

    const result = await createEmployee(mongoClient, body);

    res.json(result);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

employeeController.delete("/:id", authUser("admin"), (req, res) => {
  (async () => {
    const result = await deleteEmployee(mongoClient, req.params.id);

    res.send(result);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});
