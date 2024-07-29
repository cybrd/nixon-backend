import { Router } from "express";
import { sign } from "jsonwebtoken";

import { authUser } from "../services/user";

export const userController = Router();

type UserSignInBody = {
  username: string;
  password: string;
};

userController.post("/login", (req, res) => {
  (async () => {
    const body = req.body as UserSignInBody;

    const user = await authUser(body.username, body.password);

    if (user) {
      res.send({
        username: user.username,
        role: user.role,
        token: sign(
          {
            username: body.username,
            password: body.password,
          },
          "secret"
        ),
      });
    } else {
      res.status(401).send("invalid login");
    }
  })().catch((err) => {
    console.trace(err);
    res.sendStatus(500);
  });
});
