import { Filter } from "mongodb";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import moment from "moment";

import { ONE, ONE_THOUSAND } from "../constants";
import { mongoClient } from "../connections";

import { getViolation, getViolationCount } from "../services/violation";
import { Violation } from "../models/violation";
import { authUser } from "../middlewares/auth";
import { getEmployees } from "../services/employee";
import { objectRemoveEmpty } from "../helper/object-remove-empty";

export const violationSummaryController = Router();

const customFilterTransform = (filter: Record<string, string>) => {
  const newFilter: Filter<Violation> = filter;

  if (newFilter.dateFrom) {
    if (!newFilter.parsedDateOfIncident) {
      newFilter.parsedDateOfIncident = {};
    }

    newFilter.parsedDateOfIncident.$gte = new Date(
      moment(newFilter.dateFrom).unix() * ONE_THOUSAND
    );

    delete newFilter.dateFrom;
  }

  if (newFilter.dateTo) {
    if (!newFilter.parsedDateOfIncident) {
      newFilter.parsedDateOfIncident = {};
    }

    newFilter.parsedDateOfIncident.$lte = new Date(
      moment(newFilter.dateTo).unix() * ONE_THOUSAND
    );

    delete newFilter.dateTo;
  }

  return newFilter;
};

violationSummaryController.get("/:id", authUser("supervisor"), (req, res) => {
  (async () => {
    const { page, ...filters } = req.query as Record<string, string>;
    const cleanFilter = customFilterTransform(
      objectRemoveEmpty({
        ...filters,
        employeeNumber: req.params.id,
      })
    );

    let pageOption = 0;
    if (page) {
      pageOption = Number(page) - ONE;
    }

    const [data, counts, employee] = await Promise.all([
      getViolation(
        mongoClient,
        { limit: 99999, page: pageOption },
        cleanFilter
      ),
      getViolationCount(mongoClient, cleanFilter),
      getEmployees(
        mongoClient,
        { limit: 1, page: pageOption },
        { fingerPrintId: req.params.id }
      ),
    ]);

    res.json({
      employee: employee.shift(),
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
