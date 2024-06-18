import { Router } from "express";
import { format } from "date-fns";
import bcrypt from "bcrypt";
import { createAdmission, createPatient, getPatient } from "../database.js";

const admissionRouter = Router();

// New Admission
admissionRouter.post("/new", async (req, res) => {
  try {
    const {
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
      complaints,
      medications,
      emergencyName,
      emergencyRelationship,
      emergencyContactNumber,
    } = req.body;

    const patient = await createPatient(
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
    );

    await createAdmission(patient.patientID, complaints, medications);
    res.send(patient);
  } catch (err) {
    console.error("Error creating new patient admission", err);
    res.status(500).send("Failed to create new patient admission");
  }
});

// Returning Admission
admissionRouter.post("/returning", async (req, res) => {
  try {
    const { patientID, complaints, medications } = req.body;
    await createAdmission(patientID, complaints, medications);
    res.send("Created returning patient admission successfully");
  } catch (err) {
    console.error("Error creating returning patient admission", err);
    res
      .status(500)
      .send("Multiple admissions in the same day is not allowed currently");
  }
});

admissionRouter.post("/returning/login", async (req, res) => {
  try {
    const { patientID, password } = req.body;

    const patient = await getPatient(patientID);
    if (!patient) return res.status(401).send("Wrong credentials");

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) return res.status(401).send("Wrong credentials");

    res.send("Login successful");
  } catch (err) {
    console.error("Error logging in as patient", err);
    res.status(500).send("Failed to login as patient");
  }
});

admissionRouter.post("/returning/login2", async (req, res) => {
  try {
    const { patientID, dateOfBirth, contactNumber } = req.body;

    const patient = await getPatient(patientID);
    if (!patient) return res.status(401).send("Wrong credentials");

    if (format(patient.dateOfBirth, "yyyy-MM-dd") != dateOfBirth) {
      return res.status(401).send("Wrong credentials");
    }

    if (patient.contactNumber != contactNumber) {
      return res.status(401).send("Wrong credentials");
    }

    res.send(patient);
  } catch (err) {
    console.error("Error logging in as patient", err);
    res.status(500).send("Failed to login as patient");
  }
});

export default admissionRouter;
