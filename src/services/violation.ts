import { MongoClient, ObjectId } from "mongodb";

import { Count } from "../models/mongodb";
import { Violation } from "../models/violation";

export const getViolation = (
  client: MongoClient,
  options = { limit: 25, page: 0 },
  filter = {}
) => {
  console.log("getViolation");

  const collection = client.db("nixon").collection<Violation>("violation");

  return collection
    .aggregate([
      {
        $lookup: {
          as: "employeeData",
          foreignField: "fingerPrintId",
          from: "employee",
          localField: "employeeNumber",
        },
      },
      {
        $match: {
          employeeData: {
            $ne: [],
          },
          ...filter,
        },
      },
      {
        $replaceWith: {
          $unsetField: {
            field: "employeeData",
            input: "$$ROOT",
          },
        },
      },
    ])
    .sort({ controlNumber: -1 })
    .skip(options.page * options.limit)
    .limit(options.limit)
    .toArray();
};

export const getViolationById = (client: MongoClient, id: string) => {
  console.log("getViolationById");

  const collection = client.db("nixon").collection<Violation>("violation");

  return collection.findOne({ _id: new ObjectId(id) });
};

export const getViolationCount = (client: MongoClient, filter = {}) => {
  console.log("getViolationCount");

  const collection = client.db("nixon").collection<Violation>("violation");

  return collection
    .aggregate<Count>([
      {
        $lookup: {
          as: "employeeData",
          foreignField: "fingerPrintId",
          from: "employee",
          localField: "employeeNumber",
        },
      },
      {
        $match: {
          employeeData: {
            $ne: [],
          },
          ...filter,
        },
      },
      {
        $count: "count",
      },
    ])
    .next();
};

export const createViolation = (client: MongoClient, data: Violation) => {
  console.log("createViolation");

  const collection = client.db("nixon").collection<Violation>("violation");

  return collection.insertOne(data);
};

export const updateViolation = (
  client: MongoClient,
  id: string,
  data: Violation
) => {
  console.log("updateViolation");

  const collection = client.db("nixon").collection<Violation>("violation");

  return collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
};

export const deleteViolation = (client: MongoClient, id: string) => {
  console.log("deleteViolation");

  const collection = client.db("nixon").collection<Violation>("violation");

  return collection.deleteOne({ _id: new ObjectId(id) });
};

export const createManyViolation = (client: MongoClient, data: Violation[]) => {
  console.log("createManyViolation");

  const collection = client.db("nixon").collection<Violation>("violation");

  return collection.insertMany(data, { ordered: false });
};
