import serverless from "serverless-http";
import express from "express";
import { Handler } from "aws-lambda";

const app = express();

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.get("/hello", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

const handler = serverless(app);

export const index: Handler = async (event, context) => {
  const result = await handler(event, context);
  return result;
};
