import { AnyBulkWriteOperation, MongoClient, ObjectId } from "mongodb";
import moment from "moment";

import { Count } from "../models/mongodb";
import { Violation } from "../models/violation";

export const getViolation = (
  client: MongoClient,
  options = { limit: 25, page: 0 },
  filter = {}
) => {
  console.log("getViolation", filter);

  const collection = client.db("nixon").collection<Violation>("violation");

  return collection
    .aggregate<Violation>([
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
  console.log("getViolationById", id);

  const collection = client.db("nixon").collection<Violation>("violation");

  return collection.findOne({ _id: new ObjectId(id) });
};

export const getViolationByControlNumber = (
  client: MongoClient,
  controlNumber: string
) => {
  console.log("getViolationByControlNumber", controlNumber);

  const collection = client.db("nixon").collection<Violation>("violation");

  return collection.findOne({ controlNumber });
};

export const getViolationCount = (client: MongoClient, filter = {}) => {
  console.log("getViolationCount", filter);

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
  console.log("recountByEmployee", employeeNumber);

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

      return updateViolation(
        client,
        String(record._id),
        { numberOfTimes: String(counter[record.under][record.violation]) },
        false
      );
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
  data: Partial<Violation>,
  runRecount = true
) => {
  console.log("updateViolation", id);

  const collection = client.db("nixon").collection<Violation>("violation");

  return collection
    .updateOne({ _id: new ObjectId(id) }, { $set: data })
    .then(() => {
      if (runRecount) {
        return recountByEmployee(client, data.employeeNumber || "");
      }

      return null;
    });
};

export const deleteViolation = async (client: MongoClient, id: string) => {
  console.log("deleteViolation", id);

  const collection = client.db("nixon").collection<Violation>("violation");

  const record = await getViolationById(client, id);

  return collection
    .deleteOne({ _id: new ObjectId(id) })
    .then(() => recountByEmployee(client, record?.employeeNumber || ""));
};

export const createManyViolation = (client: MongoClient, data: Violation[]) => {
  console.log("createManyViolation");

  const collection = client.db("nixon").collection<Violation>("violation");

  return collection.insertMany(data, { ordered: false }).finally(() => {
    const employees = new Set<string>();
    data.forEach((x) => {
      employees.add(x.employeeNumber);
    });

    return Array.from(employees).map((employee) =>
      recountByEmployee(client, employee)
    );
  });
};

export const upsertManyViolation = (client: MongoClient, data: Violation[]) => {
  console.log("upsertManyViolation");

  const collection = client.db("nixon").collection<Violation>("violation");

  const ops: AnyBulkWriteOperation<Violation>[] = data.map((item) => ({
    updateOne: {
      filter: { controlNumber: item.controlNumber },
      update: { $set: item },
      upsert: true,
    },
  }));

  return collection.bulkWrite(ops, { ordered: false });
};
