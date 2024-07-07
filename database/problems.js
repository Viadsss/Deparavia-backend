import pool from "./database.js";

// Simple
// Problem 1
// Problem 2
// Problem 3

// Medium
// Problem 4
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

// Problem 5
// Problem 6
// Problem 7

// Difficult
// Problem 8
// Problem 9
// Problem 10
