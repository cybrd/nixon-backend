import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import moment from "moment";

import { ONE } from "../constants";
import { mongoClient } from "../connections";

import {
  createViolation,
  deleteViolation,
  getViolation,
  getViolationByControlNumber,
  getViolationById,
  getViolationCount,
  updateViolation,
  upsertManyViolation,
} from "../services/violation";
import { Handbook } from "../models/handbook";
import { Violation } from "../models/violation";
import { authUser } from "../middlewares/auth";
import { getEmployeeByFingerPrintId } from "../services/employee";
import { getHandbook } from "../services/handbook";
import { objectRemoveEmpty } from "../helper/object-remove-empty";

export const violationController = Router();

const getEmployeeName = async (fingerPrintId: string) => {
  const employee = await getEmployeeByFingerPrintId(mongoClient, fingerPrintId);

  return employee?.name || "";
};

const customViolationFill = async (
  oldRecord: Violation,
  handbook: Handbook[]
) => {
  const record = oldRecord;

  if (record.under?.includes("-")) {
    const [under, violation] = record.under.split("-");

    record.under = under;
    record.violation = violation;
  }

  if (!record.penalty || !record.description) {
    if (record.under && record.violation) {
      const violation = handbook.find(
        (x) => x.under === record.under && x.violation === record.violation
      );

      if (violation) {
        if (!record.penalty) {
          record.penalty = violation.penalty;
        }
        if (!record.description) {
          record.description = violation.description;
        }
      }
    }
  }

  if (record.employeeNumber) {
    const employee = await getEmployeeByFingerPrintId(
      mongoClient,
      record.employeeNumber
    );

    if (employee) {
      if (!record.employeeName) {
        record.employeeName = employee.name;
      }
      if (!record.position) {
        record.position = employee.position;
      }
      if (!record.department) {
        record.department = employee.department;
      }
    }
  }

  if (record.deptHead && !isNaN(record.deptHead as unknown as number)) {
    record.deptHead = await getEmployeeName(record.deptHead);
  }

  if (record.reportedBy && !isNaN(record.reportedBy as unknown as number)) {
    record.reportedBy = await getEmployeeName(record.reportedBy);
  }

  if (record.dateOfIncident) {
    record.parsedDateOfIncident = new Date(
      moment(record.dateOfIncident).valueOf()
    );
  }

  return record;
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

violationController.get(
  "/print/:controlNumber",
  authUser("supervisor"),
  (req, res) => {
    (async () => {
      const result = await getViolationByControlNumber(
        mongoClient,
        req.params.controlNumber
      );

      res.send(result);
    })().catch((err) => {
      console.trace(err);
      res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  }
);

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
    const handbook = await getHandbook(mongoClient);

    const result = await updateViolation(
      mongoClient,
      req.params.id,
      await customViolationFill(body, handbook)
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
    const handbook = await getHandbook(mongoClient);

    const result = await createViolation(
      mongoClient,
      await customViolationFill(body, handbook)
    );

    res.json(result);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

violationController.delete("/:id", authUser("admin"), (req, res) => {
  (async () => {
    const result = await deleteViolation(mongoClient, req.params.id);

    res.send(result);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});

violationController.post("/upload", authUser("admin"), (req, res) => {
  (async () => {
    const body = req.body as Record<string, string>[];
    const handbook = await getHandbook(mongoClient);

    const violations: Partial<Violation>[] = await Promise.all(
      body.map((record) => {
        const violation = {
          action: record.Action,
          controlNumber: record["Control #"],
          dateOfIncident: record["Date(s) of Incident"],
          department: record["Dept."],
          deptHead: record["Dept. Head"],
          employeeNumber: record["Employee No."],
          incidentDescription:
            record["Incident Description"] ||
            record["Description of the Incident(s) or Behavior(s)"],
          position: record.Position,
          reportedBy: record["Reported by"],
          timeOfIncident: record["Time of Incident"],
          under: record.Under,
          violation: record["Violation #"],
        } as Violation;

        return customViolationFill(violation, handbook);
      })
    );

    upsertManyViolation(mongoClient, violations as Violation[])
      .then(res.json)
      .catch((err) => {
        console.error(err);
        res.json(err.message);
      });
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});
