import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { ONE } from "../constants";
import { mongoClient } from "../connections";

import { getViolation, getViolationCount } from "../services/violation";
import { authUser } from "../middlewares/auth";
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
