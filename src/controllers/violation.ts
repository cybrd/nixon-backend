import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { mongoClient } from "../connections";

import { authUser } from "../middlewares/auth";
import { getViolation } from "../services/violation";

export const violationController = Router();

violationController.get("/", authUser("supervisor"), (req, res) => {
  (async () => {
    const result = await getViolation(mongoClient);

    res.send(result);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});
