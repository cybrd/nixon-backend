import { Router } from "express";
import { authUser } from "../middlewares/auth";

export const testController = Router();

testController.get("/supervisor", authUser("supervisor"), (req, res) => {
  res.send(Math.random());
});

testController.get("/admin", authUser("admin"), (req, res) => {
  res.send(Math.random());
});
