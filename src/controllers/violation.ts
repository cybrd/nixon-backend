import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import multer from "multer";
import { parse } from "csv-parse";

import { ONE } from "../constants";
import { mongoClient } from "../connections";

import {
  createManyViolation,
  createViolation,
  deleteViolation,
  getViolation,
  getViolationCount,
} from "../services/violation";
import { Violation } from "../models/violation";
import { authUser } from "../middlewares/auth";
import { getEmployeeByFingerPrintId } from "../services/employee";
import { objectRemoveEmpty } from "../helper/object-remove-empty";

export const violationController = Router();

const customTransform = (oldObj: Record<string, string>) => {
  const newObj: typeof oldObj = {};

  for (const prop in oldObj) {
    if (typeof oldObj[prop] !== "undefined") {
      switch (prop) {
        case "fingerPrintId":
          newObj.employeeNumber = oldObj[prop];
          break;
        default:
          newObj[prop] = oldObj[prop];
          break;
      }
    }
  }
  return newObj;
};

violationController.get("/", authUser("supervisor"), (req, res) => {
  (async () => {
    const { page, ...filters } = req.query as Record<string, string>;
    const cleanFilter = customTransform(objectRemoveEmpty(filters));

    let pageOption = 0;
    if (page) {
      pageOption = Number(page) - ONE;
    }

    const [data, counts] = await Promise.all([
      getViolation(mongoClient, { limit: 25, page: pageOption }, cleanFilter),
      getViolationCount(mongoClient, cleanFilter),
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

const getEmployeeName = async (fingerPrintId: string) => {
  const employee = await getEmployeeByFingerPrintId(mongoClient, fingerPrintId);

  return employee?.name || "";
};

violationController.post("/create", authUser("supervisor"), (req, res) => {
  (async () => {
    const body = req.body as Violation;

    if (body.under?.includes("-")) {
      const [under, violation] = body.under.split("-");

      body.under = under;
      body.violation = violation;
    }

    if (body.employeeNumber) {
      const employee = await getEmployeeByFingerPrintId(
        mongoClient,
        body.employeeNumber
      );

      if (employee) {
        body.employeeName = employee.name;
        body.position = employee.position;
        body.department = employee.department;
      }
    }

    if (body.deptHead) {
      body.deptHead = await getEmployeeName(body.deptHead);
    }

    if (body.reportedBy) {
      body.reportedBy = await getEmployeeName(body.reportedBy);
    }

    const result = await createViolation(mongoClient, body);

    res.send(result);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

violationController.delete("/:id", authUser("supervisor"), (req, res) => {
  (async () => {
    const result = await deleteViolation(mongoClient, req.params.id);

    res.send(result);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

violationController.post(
  "/import",
  authUser("supervisor"),
  multer().single("file"),
  (req, res) => {
    if (req.file) {
      parse(req.file as unknown as string, { columns: true }, (err, rows) => {
        createManyViolation(mongoClient, rows)
          .then(() => res.send("ok"))
          .catch(console.error);
      });
    } else {
      res.send("ok");
    }
  }
);
