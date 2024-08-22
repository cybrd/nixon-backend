import moment from "moment";

import { mongoClient } from "../src/connections";

import { getViolation, updateViolation } from "../src/services/violation";

const main = async () => {
  const violations = await getViolation(mongoClient, { limit: 99999, page: 0 });
  const ms = 1000;

  for await (const violation of violations) {
    await updateViolation(
      mongoClient,
      violation._id.toString(),
      {
        parsedDateOfIncident: new Date(
          moment(violation.dateOfIncident).unix() * ms
        ),
      },
      false
    );
  }

  process.exit();
};

main().catch(console.error);
