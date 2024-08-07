import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { ONE } from "../constants";
import { mongoClient } from "../connections";

import { getViolation, getViolationCount } from "../services/violation";
import { authUser } from "../middlewares/auth";
import { objectRemoveEmpty } from "../helper/object-remove-empty";

export const violationController = Router();

violationController.get("/", authUser("supervisor"), (req, res) => {
  (async () => {
    const { page, ...filters } = req.query as { [k: string]: string };
    const cleanFilter = objectRemoveEmpty(filters);

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
