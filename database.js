import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

// * GET FUNCTIONS
export async function getAdmissions() {
  const [rows] = await pool.query(`
    SELECT * FROM admission
  `);
  return rows;
}

export async function getDoctors() {
  const [rows] = await pool.query(`
    SELECT * FROM doctor
  `);
  return rows;
}

export async function getDoctor(doctorID) {
  const [rows] = await pool.query(
    `
    SELECT * FROM doctor
    WHERE doctorID = ?
  `,
    [doctorID]
  );

  return rows[0];
}

export async function getPatients() {
  const [rows] = await pool.query(`
    SELECT * FROM patient
  `);
  return rows;
}

export async function getPatient(patientID) {
  const [rows] = await pool.query(
    `
    SELECT * FROM patient
    WHERE patientID = ?
  `,
    [patientID]
  );

  return rows[0];
}

// * CREATE FUNCTIONS

export async function createAdmission(patientID, complaints, medications) {
  await pool.query(
    `
    INSERT INTO admission (patientID, admissionDate, complaints, medications)
    VALUES (?, CURDATE(), ?, ?)
  `,
    [patientID, complaints, medications]
  );
}

export async function createDoctor(
  doctorName,
  doctorStartTime,
  doctorEndTime,
  doctorPassword
) {
  await pool.query(
    `
    INSERT INTO doctor (doctorName, doctorStartTime, doctorEndTime, doctorPassword)
    VALUES (?, ?, ?, ?)
  `,
    [doctorName, doctorStartTime, doctorEndTime, doctorPassword]
  );
}

export async function createPatient(
  firstName,
  lastName,
  middleName,
  dateOfBirth,
  sex,
  height,
  weight,
  maritalStatus,
  contactNumber,
  emailAddress,
  streetAddress,
  city,
  province,
  zipCode,
  emergencyName,
  emergencyRelationship,
  emergencyContactNumber,
  password
) {
  await pool.query(
    `
    INSERT INTO patient (firstName, lastName, middleName, dateOfBirth, sex, height, weight, maritalStatus, contactNumber, emailAddress, streetAddress, city, province, zipCode, emergencyName, emergencyRelationship, emergencyContactNumber, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      firstName,
      lastName,
      middleName,
      dateOfBirth,
      sex,
      height,
      weight,
      maritalStatus,
      contactNumber,
      emailAddress,
      streetAddress,
      city,
      province,
      zipCode,
      emergencyName,
      emergencyRelationship,
      emergencyContactNumber,
      password,
    ]
  );

  const firstNameInitial = firstName.charAt(0);
  const lastNameInitial = lastName.charAt(0);

  const idPattern = `PAT-${firstNameInitial}${lastNameInitial}-%`;

  const [lastInsertedId] = await pool.query(
    `
    SELECT patientID FROM patient
    WHERE patientID LIKE ?
    ORDER BY patientID DESC
    LIMIT 1
  `,
    [idPattern]
  );

  const { patientID } = lastInsertedId[0];
  return getPatient(patientID);
}

// * UPDATE functions
export async function updateAdmissionDoctor(admissionID, doctorID) {
  await pool.query(
    `
    UPDATE admission 
    SET doctorID = ? 
    WHERE admissionID = ?;
  `,
    [doctorID, admissionID]
  );
}

export async function updateDoctorShift(
  doctorID,
  doctorStartTime,
  doctorEndtime
) {
  await pool.query(
    `
    UPDATE doctor
    SET doctorStartTime = ?, doctorEndTime = ?
    WHERE doctorID = ? 
  `,
    [doctorStartTime, doctorEndtime, doctorID]
  );
}

// * DELETE functions

export async function deleteAdmission(admissionID) {
  await pool.query(
    `
    DELETE FROM admission
    WHERE admissionID = ?
  `,
    [admissionID]
  );
}
