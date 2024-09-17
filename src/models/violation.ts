import { ObjectId } from "mongodb";

export type Violation = {
  _id: ObjectId;
  controlNumber: string;
  employeeNumber: string;
  employeeName: string;
  department: string;
  position: string;
  deptHead: string;
  dateOfIncident: string;
  timeOfIncident: string;
  reportedBy: string;
  incidentDescription: string;
  under: string;
  violation: string;
  description: string;
  penalty: string;
  numberOfTimes: string;
  parsedDateOfIncident: BetweenDate & Date;
  action: string;
};

type BetweenDate = { $gte?: Date; $lte?: Date };
