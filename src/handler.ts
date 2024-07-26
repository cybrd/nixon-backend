import { Handler } from "aws-lambda";

export const index: Handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify("Deployed"),
  };
};
