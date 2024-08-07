import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { ONE } from "../constants";
import { mongoClient } from "../connections";

import { getViolation, getViolationCount } from "../services/violation";
import { authUser } from "../middlewares/auth";

export const violationController = Router();

violationController.get("/", authUser("supervisor"), (req, res) => {
  (async () => {
    const { page } = req.query;
    let pageOption = 0;
    if (page) {
      pageOption = Number(page) - ONE;
    }

    const [data, counts] = await Promise.all([
      getViolation(mongoClient, { limit: 25, page: pageOption }),
      getViolationCount(mongoClient),
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
