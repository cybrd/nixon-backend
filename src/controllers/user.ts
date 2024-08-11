import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { sign } from "jsonwebtoken";

import { mongoClient } from "../connections";

import { getUserByUsernameAndPassword } from "../services/user";

export const userController = Router();

type UserSignInBody = {
  username: string;
  password: string;
};

userController.post("/login", (req, res) => {
  (async () => {
    const body = req.body as UserSignInBody;

    const user = await getUserByUsernameAndPassword(
      mongoClient,
      body.username,
      body.password
    );

    if (user) {
      res.json({
        role: user.role,
        token: sign(
          {
            role: user.role,
            username: body.username,
          },
          "secret"
        ),
        username: user.username,
      });
    } else {
      res.status(StatusCodes.UNAUTHORIZED).send("invalid login");
    }
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  });
});
