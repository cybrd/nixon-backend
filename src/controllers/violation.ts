import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import moment from "moment";

import { ONE, ONE_THOUSAND } from "../constants";
import { mongoClient } from "../connections";

import {
  createManyViolation,
  createViolation,
  deleteViolation,
  getViolation,
  getViolationById,
  getViolationCount,
  updateViolation,
} from "../services/violation";
import { Violation } from "../models/violation";
import { authUser } from "../middlewares/auth";
import { getEmployeeByFingerPrintId } from "../services/employee";
import { objectRemoveEmpty } from "../helper/object-remove-empty";

export const violationController = Router();

const getEmployeeName = async (fingerPrintId: string) => {
  const employee = await getEmployeeByFingerPrintId(mongoClient, fingerPrintId);

  return employee?.name || "";
};

const customViolationFill = async (oldBody: Violation) => {
  const body = oldBody;

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

  if (body.dateOfIncident) {
    body.parsedDateOfIncident = new Date(
      moment(body.dateOfIncident).unix() * ONE_THOUSAND
    );
  }

  return body;
};

violationController.get("/", authUser("supervisor"), (req, res) => {
  (async () => {
    const { page, ...filters } = req.query as Record<string, string>;
    const cleanFilter = objectRemoveEmpty(filters);

    let pageOption = 0;
    if (page) {
      pageOption = Number(page) - ONE;
    }

    const [data, counts] = await Promise.all([
      getViolation(mongoClient, { limit: 25, page: pageOption }, cleanFilter),
      getViolationCount(mongoClient, cleanFilter),
    ]);

    res.json({
      counts: counts?.count,
      data,
    });
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

violationController.get("/:id", authUser("supervisor"), (req, res) => {
  (async () => {
    const result = await getViolationById(mongoClient, req.params.id);

    res.send(result);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

violationController.put("/:id", authUser("supervisor"), (req, res) => {
  (async () => {
    const body = req.body as Violation;

    const result = await updateViolation(
      mongoClient,
      req.params.id,
      await customViolationFill(body)
    );

    res.send(result);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

violationController.post("/create", authUser("supervisor"), (req, res) => {
  (async () => {
    const body = req.body as Violation;

    const result = await createViolation(
      mongoClient,
      await customViolationFill(body)
    );

    res.json(result);
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

violationController.post("/upload", authUser("supervisor"), (req, res) => {
  const keys = [
    "controlNumber",
    "employeeNumber",
    "employeeName",
    "department",
    "position",
    "deptHead",
    "dateOfIncident",
    "timeOfIncident",
    "reportedBy",
    "incidentDescription",
    "under",
    "violation",
    "description",
    "penalty",
    "numberOfTimes",
  ] as const;

  const body = req.body as string[][];

  const violations = body.map((record) => {
    const violation: Partial<Violation> = {};

    record.forEach((x, i) => {
      violation[keys[i]] = x;
    });

    return violation;
  });

  createManyViolation(mongoClient, violations as Violation[])
    .then(res.json)
    .catch((err) => {
      console.error(err);
      res.json(err.message);
    });
});
