import { Filter } from "mongodb";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import moment from "moment";

import { ONE, ONE_THOUSAND } from "../constants";
import { mongoClient } from "../connections";

import { getEmployees, getEmployeesCount } from "../services/employee";
import { Violation } from "../models/violation";
import { authUser } from "../middlewares/auth";
import { objectRemoveEmpty } from "../helper/object-remove-empty";

export const employeeController = Router();

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

employeeController.get("/", authUser("supervisor"), (req, res) => {
  (async () => {
    const { page, ...filters } = req.query as Record<string, string>;
    const cleanFilter = customFilterTransform(objectRemoveEmpty(filters));

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
