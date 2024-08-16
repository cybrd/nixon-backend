import { mongoClient } from "../src/connections";

import { getEmployees } from "../src/services/employee";
import { recountByEmployee } from "../src/services/violation";

const main = async () => {
  const employees = await getEmployees(mongoClient, { limit: 99999, page: 0 });

  for await (const employee of employees) {
    await recountByEmployee(mongoClient, employee.fingerPrintId);
  }

  process.exit();
};

main().catch(console.error);
