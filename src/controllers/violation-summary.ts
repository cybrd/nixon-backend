import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { ONE, ZERO } from "../constants";
import { mongoClient } from "../connections";

import { getViolation, getViolationCount } from "../services/violation";
import { authUser } from "../middlewares/auth";
import { getEmployees } from "../services/employee";
import { objectRemoveEmpty } from "../helper/object-remove-empty";

export const violationSummaryController = Router();

violationSummaryController.get("/:id", authUser("supervisor"), (req, res) => {
  (async () => {
    const { page, ...filters } = req.query as Record<string, string>;
    const cleanFilter = objectRemoveEmpty({
      ...filters,
      employeeNumber: req.params.id,
    });

    let pageOption = 0;
    if (page) {
      pageOption = Number(page) - ONE;
    }

    const [data, counts, employee] = await Promise.all([
      getViolation(mongoClient, { limit: 25, page: pageOption }, cleanFilter),
      getViolationCount(mongoClient, cleanFilter),
      getEmployees(
        mongoClient,
        { limit: 25, page: pageOption },
        { fingerPrintId: req.params.id }
      ),
    ]);

    res.json({
      employee: employee[ZERO],
      violations: {
        counts: counts?.count,
        data,
      },
    });
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});
