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
    ORDER BY admissionDate DESC
  `);
  return rows;
}

export async function getAdmissionsNoDoctor() {
  const [rows] = await pool.query(`
    SELECT * FROM admission
    WHERE doctorID IS NULL
    ORDER BY admissionDate DESC
  `);
  return rows;
}

export async function getAdmissionsNotDischarge() {
  const [rows] = await pool.query(`
    SELECT * FROM admission
    WHERE dischargeDate IS NULL
    ORDER BY admissionDate DESC
  `);
  return rows;
}

export async function getDoctors() {
  const [rows] = await pool.query(`
    SELECT * FROM doctor
  `);
  return rows;
}

export async function getAdmissionsTotal() {
  const [rows] = await pool.query(`
    SELECT COUNT(*) AS total FROM admission
  `);
  return rows[0];
}

export async function getAdmissionsNoDoctorTotal() {
  const [rows] = await pool.query(`
    SELECT COUNT(*) AS total FROM admission
    WHERE doctorID IS NULL
  `);
  return rows[0];
}

export async function getAdmissionsNotDischargeTotal() {
  const [rows] = await pool.query(`
    SELECT COUNT(*) AS total FROM admission
    WHERE dischargeDate IS NULL
  `);
  return rows[0];
}

export async function getDoctor(doctorID) {
  const [rows] = await pool.query(
    `
    SELECT * FROM doctor
    WHERE BINARY doctorID = ?
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
    WHERE BINARY patientID = ?
  `,
    [patientID]
  );

  return rows[0];
}

export async function getPatientsOfDoctor(doctorID) {
  const [rows] = await pool.query(
    `
    SELECT
      admission.admissionID,
      patient.patientID,
      CONCAT(patient.firstName, ' ', patient.lastName, ' ', patient.middleName) AS fullName,
      patient.sex,
      patient.height,
      patient.weight,
      admission.complaints,
      admission.medications,
      admission.procedure,
      admission.diagnosis
    FROM patient, admission
    WHERE patient.patientID = admission.patientID
      AND admission.doctorID = ?
      AND admission.dischargeDate IS NULL
  `,
    [doctorID]
  );
  return rows;
}

export async function getVisitors() {
  const [rows] = await pool.query(`
    SELECT * FROM visitor
    ORDER BY visitorID DESC
  `);
  return rows;
}

export async function getPatientVisitors(patientID) {
  const [rows] = await pool.query(
    `
    SELECT
      visitorName,
      visitorRelationship,
      visitorContactNumber,
      visitorDate
    FROM visitor
    WHERE patientID = ?
    ORDER BY visitorDate DESC
    `,
    [patientID]
  );

  return rows;
}

export async function getPatientAdmissions(patientID) {
  const [rows] = await pool.query(
    `
    SELECT 
      admission.admissionID,
      doctor.doctorName,
      admission.complaints,
      admission.medications,
      admission.procedure,
      admission.diagnosis,
      admission.admissionDate,
      admission.dischargeDate
    FROM admission
    LEFT JOIN doctor ON admission.doctorID = doctor.doctorID
    WHERE admission.patientID = ?
    ORDER BY admissionDate DESC, dischargeDate DESC
    `,
    [patientID]
  );

  return rows;
}

export async function getPatientAdmissionsTotal(patientID) {
  const [rows] = await pool.query(
    `
    SELECT COUNT(*) AS total FROM admission
    WHERE patientID = ?
  `,
    [patientID]
  );

  return rows[0];
}

export async function getPatientsTotal() {
  const [rows] = await pool.query(`
    SELECT COUNT(*) AS total FROM patient
  `);

  return rows[0];
}

// GET Doctor Total - Jhana
export async function getDoctorsTotal() {
  const [rows] = await pool.query(`
    SELECT COUNT(*) AS total FROM doctor
  `);

  return rows[0];
}

// GET Visitor Total - Hazel
export async function getVisitorsTotal() {
  const [rows] = await pool.query(`
    SELECT COUNT(*) AS total FROM visitor
  `);

  return rows[0];
}

export async function getPatientVisitorsTotal(patientID) {
  const [rows] = await pool.query(
    `
    SELECT COUNT(*) AS total
    FROM visitor
    WHERE patientID = ?
    `,
    [patientID]
  );
  return rows[0];
}

// * CREATE Functions

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
  emergencyContactNumber
) {
  await pool.query(
    `
    INSERT INTO patient (firstName, lastName, middleName, dateOfBirth, sex, height, weight, maritalStatus, contactNumber, emailAddress, streetAddress, city, province, zipCode, emergencyName, emergencyRelationship, emergencyContactNumber)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

export async function createVisitor(
  patientID,
  visitorName,
  visitorRelationship,
  visitorContactNumber
) {
  await pool.query(
    `
    INSERT INTO visitor (patientID, visitorDate, visitorName, visitorRelationship, visitorContactNumber)
    VALUES (?, CURDATE(), ?, ?, ?)
  `,
    [patientID, visitorName, visitorRelationship, visitorContactNumber]
  );
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

export async function updateDoctorPassword(doctorID, newPassword) {
  await pool.query(
    `
    UPDATE doctor
    SET doctorPassword = ?
    WHERE doctorID = ?
  `,
    [newPassword, doctorID]
  );
}

export async function updatePatientProcedure(admissionID, procedure) {
  await pool.query(
    `
    UPDATE admission
    SET \`procedure\` = ?
    WHERE admissionID = ?
  `,
    [procedure, admissionID]
  );
}

export async function updatePatientDiagnosis(admissionID, diagnosis) {
  await pool.query(
    `
    UPDATE admission
    SET diagnosis = ?
    WHERE admissionID = ?
  `,
    [diagnosis, admissionID]
  );
}

export async function updatePatientDischarge(admissionID) {
  await pool.query(
    `
    UPDATE admission
    SET dischargeDate = CURDATE()
    WHERE admissionID = ?
  `,
    [admissionID]
  );
}

export async function updatePatientDetails(patientID, details) {
  const {
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
  } = details;

  await pool.query(
    `
    UPDATE patient
    SET
      height = ?,
      weight = ?,
      maritalStatus = ?,
      contactNumber = ?,
      emailAddress = ?,
      streetAddress = ?,
      city = ?,
      province = ?,
      zipCode = ?,
      emergencyName = ?,
      emergencyRelationship = ?,
      emergencyContactNumber = ?
    WHERE patientID = ?
  `,
    [
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
      patientID,
    ]
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
