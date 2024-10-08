import type { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import type { WithId } from "mongodb";
import { verify } from "jsonwebtoken";

import { mongoClient } from "../connections";

import { User } from "../models/user";
import { getUserByUsername } from "../services/user";

declare module "express-serve-static-core" {
  interface Request {
    user: WithId<User>;
  }
}

export const authUser =
  (role: User["role"]): RequestHandler =>
  (req, res, next) => {
    console.log("authUser", role);

    if (!req.headers.authorization) {
      res.sendStatus(StatusCodes.UNAUTHORIZED);
      return;
    }

    const [_, token] = req.headers.authorization.split(" ");

    try {
      const userToken = verify(token, "secret") as User;

      if (userToken.role === "admin" || role === userToken.role) {
        getUserByUsername(mongoClient, userToken.username)
          .then((user) => {
            if (user) {
              req.user = user;
              next();
            } else {
              res.sendStatus(StatusCodes.UNAUTHORIZED);
            }
          })
          .catch((e) => {
            console.error(e);
            res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
          });
      } else {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
      }
    } catch {
      res.sendStatus(StatusCodes.UNAUTHORIZED);
    }
  };
