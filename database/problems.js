import pool from "./database.js";

// Problem 1
// Display the marital statuses of patients where there are more than 5 patients in each status.
export async function getProblem4() {
  const [rows] = await pool.query(`
    SELECT maritalStatus, COUNT(*) as patientCount
    FROM patient
    GROUP BY maritalStatus
    HAVING patientCount > 5
  `);

  return rows;
}
