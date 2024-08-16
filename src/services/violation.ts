import { MongoClient, ObjectId } from "mongodb";
import moment from "moment";

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

export const recountByEmployee = async (
  client: MongoClient,
  employeeNumber: string
) => {
  console.log("recountByEmployee");

  const collection = client.db("nixon").collection<Violation>("violation");

  const records = await collection
    .aggregate<Violation>([
      {
        $match: {
          employeeNumber,
        },
      },
    ])
    .toArray();

  records.sort((a, b) => {
    const aTime = moment(`${a.dateOfIncident} ${a.timeOfIncident}`).unix();
    const bTime = moment(`${b.dateOfIncident} ${b.timeOfIncident}`).unix();

    return aTime - bTime;
  });

  const counter: { [k: string]: { [k: string]: number } } = {};

  await Promise.all(
    records.map((record) => {
      if (!counter[record.under]) {
        counter[record.under] = {};
      }

      if (!counter[record.under][record.violation]) {
        counter[record.under][record.violation] = 0;
      }

      counter[record.under][record.violation] += 1;

      return updateViolation(client, String(record._id), {
        numberOfTimes: String(counter[record.under][record.violation]),
      });
    })
  );

  return counter;
};

export const createViolation = (client: MongoClient, data: Violation) => {
  console.log("createViolation");

  const collection = client.db("nixon").collection<Violation>("violation");

  return collection
    .insertOne(data)
    .then(() => recountByEmployee(client, data.employeeNumber || ""));
};

export const updateViolation = (
  client: MongoClient,
  id: string,
  data: Partial<Violation>
) => {
  console.log("updateViolation");

  const collection = client.db("nixon").collection<Violation>("violation");

  return collection
    .updateOne({ _id: new ObjectId(id) }, { $set: data })
    .then(() => recountByEmployee(client, data.employeeNumber || ""));
};

export const deleteViolation = async (client: MongoClient, id: string) => {
  console.log("deleteViolation");

  const collection = client.db("nixon").collection<Violation>("violation");

  const record = await getViolationById(client, id);

  return collection
    .deleteOne({ _id: new ObjectId(id) })
    .then(() => recountByEmployee(client, record?.employeeNumber || ""));
};

export const createManyViolation = (client: MongoClient, data: Violation[]) => {
  console.log("createManyViolation");

  const collection = client.db("nixon").collection<Violation>("violation");

  return collection.insertMany(data, { ordered: false });
};

export const getViolationSummary = (
  client: MongoClient,
  options = { limit: 25, page: 0 },
  filter = {}
) => {
  console.log("getViolationSummary");

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
        $group: {
          _id: { a: "$employeeNumber", b: "$under", c: "$violation" },
          department: { $first: "$department" },
          description: { $first: "$description" },
          employeeName: { $first: "$employeeName" },
          employeeNumber: { $first: "$employeeNumber" },
          numberOfTimes: { $count: {} },
          penalty: { $first: "$penalty" },
          position: { $first: "$position" },
          under: { $first: "$under" },
          violation: { $first: "$violation" },
        },
      },
    ])
    .sort({ controlNumber: -1 })
    .skip(options.page * options.limit)
    .limit(options.limit)
    .toArray();
};

export const getViolationSummaryCount = (client: MongoClient, filter = {}) => {
  console.log("getViolationSummaryCount");

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
        $group: {
          _id: { a: "$employeeNumber", b: "$under", c: "$violation" },
        },
      },
      {
        $count: "count",
      },
    ])
    .next();
};
