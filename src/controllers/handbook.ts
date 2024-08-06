import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import { mongoClient } from "../connections";

import { authUser } from "../middlewares/auth";
import { getHandbook } from "../services/handbook";

export const handbookController = Router();

handbookController.get("/", authUser("supervisor"), (req, res) => {
  (async () => {
    const result = await getHandbook(mongoClient);

    res.send(result);
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});
