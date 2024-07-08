import pool from "./database.js";

// Simple
// Problem 1
// Display the first and last name of the patient including the patient ID.
export async function getProblem1() {
  const [rows] = await pool.query(`
    SELECT patientID, firstName, lastName
    FROM patient
  `);

  return rows;
}

// Problem 2
// Display the doctor's names and start times for doctors who start work before 9 AM.
export async function getProblem2() {
  const [rows] = await pool.query(`
    SELECT doctorName, doctorStartTime
    FROM doctor
    WHERE doctorStartTime < '09:00:00'
  `);

  return rows;
}

// Problem 3
// Retrieve all patients who live in Quezon City and order them by their last name.
export async function getProblem3() {
  const [rows] = await pool.query(`
    SELECT * FROM patient
    WHERE city = 'Quezon City'
    ORDER BY lastname
  `);

  return rows;
}

// Moderate
// Problem 4
// Display the marital statuses with more than 5 patients, along with the number of patients for each status.
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
// Display the visitor relationships and its total visits where there are more than 3 visits in each category.
export async function getProblem5() {
  const [rows] = await pool.query(`
    SELECT visitorRelationship, COUNT(*) as visitorCount
    FROM visitor
    GROUP BY visitorRelationship
    HAVING visitorCount > 3
  `);

  return rows;
}

// Problem 6
// Display the average weight of patients grouped by city and ordered by average weight in descending order, but only include cities where the average weight is greater than 70.
export async function getProblem6() {
  const [rows] = await pool.query(`
    SELECT city, AVG(weight) AS avg_weight
    FROM patient
    GROUP BY city
    HAVING AVG(weight) > 70
    ORDER BY avg_weight DESC
  `);

  return rows;
}

// Problem 7
// Retrieve the count of patients by city, only for cities with more than 1 patient.
export async function getProblem7() {
  const [rows] = await pool.query(`
    SELECT city, COUNT(*) as patientCount
    FROM patient
    GROUP BY city
    HAVING COUNT(*) > 1
  `);

  return rows;
}

// Difficult
// Problem 8
// Display the visitor's name of female patients, including their total visit in descending order, only include the visitors that have more than 2 visits.
export async function getProblem8() {
  const [rows] = await pool.query(`
    SELECT v.visitorName, COUNT(*) AS total_visits
    FROM visitor v, patient p
    WHERE p.patientID = v.patientID AND p.sex = 'F'
    GROUP BY v.visitorName
    HAVING total_visits > 2
    ORDER BY total_visits DESC
  `);

  return rows;
}

// Problem 9
// Display the patients' ID and their names, the total number of their admissions, and the most recent admission date. Only include patients who have been admitted more than once and sort them in descending order.
export async function getProblem9() {
  const [rows] = await pool.query(`
    SELECT
    p.patientID,  p.firstName,  p.lastName, COUNT(a.admissionID) AS total_admissions,
    MAX(a.admissionDate) AS most_recent_admission
    FROM patient p, admission a
    WHERE  p.patientID = a.patientID
    GROUP BY p.patientID, p.firstName, p.lastName
    HAVING COUNT(a.admissionID) > 1
    ORDER BY total_admissions DESC
  `);

  return rows;
}

// Problem 10
// Retrieve the doctors'ID and their respective names and the average number of days their patients stay admitted, only for doctors with an average stay duration greater than 1 and a half days.
export async function getProblem10() {
  const [rows] = await pool.query(`
    SELECT d.doctorID, d.doctorName, AVG(DATEDIFF(a.dischargeDate, a.admissionDate)) AS avgStayDuration
    FROM doctor d, admission a
    WHERE d.doctorID = a.doctorID AND a.dischargeDate IS NOT NULL
    GROUP BY d.doctorID, d.doctorName
    HAVING avgStayDuration > 1.5
  `);

  return rows;
}
