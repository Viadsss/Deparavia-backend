import { Router } from "express";
import bcrypt from "bcrypt";
import { createAdmission, createPatient } from "../database.js";

const admissionRouter = Router();

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
      password,
    } = req.body;

    const hashPassword = await bcrypt.hash(password, 13);

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
      emergencyContactNumber,
      hashPassword
    );

    console.log(patient);

    await createAdmission(patient.patientID, complaints, medications);
    res.send(patient);
  } catch (err) {
    console.error("Error creating new patient admission", err);
    res.status(500).send("Failed to create new patient admission");
  }
});

export default admissionRouter;
