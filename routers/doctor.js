import { Router } from "express";
import {
  getDoctor,
  getPatientsOfDoctor,
  updateDoctorPassword,
  updatePatientDiagnosis,
  updatePatientDischarge,
  updatePatientProcedure,
} from "../database.js";
import bcrypt from "bcrypt";

const doctorRouter = Router();

doctorRouter.post("/login", async (req, res) => {
  try {
    const { doctorID, doctorPassword } = req.body;

    const doctor = await getDoctor(doctorID);
    if (!doctor) return res.status(401).send("Wrong credentials");

    const isMatch = await bcrypt.compare(doctorPassword, doctor.doctorPassword);
    if (!isMatch) return res.status(401).send("Wrong credentials");

    res.send(doctor);
  } catch (err) {
    console.error("Error logging in as doctor", err);
    res.status(500).send("Failed to login as doctor");
  }
});

doctorRouter.get("/:id", async (req, res) => {
  try {
    const doctorID = req.params.id;
    const patients = await getPatientsOfDoctor(doctorID);

    res.send(patients);
  } catch (err) {
    console.error(`Error fetching all admissions this doctor handles`, err);
    res.status(500).send("Failed to fetch all admissions this doctor handles");
  }
});

// TODO: Total of Patient this Doctor Handles
doctorRouter.get("/:id/total", async (req, res) => {});

doctorRouter.put("/:id/password", async (req, res) => {
  try {
    const doctorID = req.params.id;
    const { originalPassword, newPassword } = req.body;

    const doctor = await getDoctor(doctorID);
    const isMatch = await bcrypt.compare(
      originalPassword,
      doctor.doctorPassword
    );
    if (!isMatch) return res.status(401).send("Incorrect original password");

    const hashPassword = await bcrypt.hash(newPassword, 13);

    await updateDoctorPassword(doctorID, hashPassword);
    res.send("Password sucessfully changed");
  } catch (err) {
    console.error("Error updating the password of doctor", err);
    res.status(500).send("Failed to update the password of doctor");
  }
});

doctorRouter.put("/:id/procedure", async (req, res) => {
  try {
    const doctorID = req.params.id;
    const { admissionID, procedure } = req.body;

    await updatePatientProcedure(admissionID, procedure);
    const patients = await getPatientsOfDoctor(doctorID);

    res.send(patients);
  } catch (err) {
    console.error("Error updating the procedure of the admission", err);
    res.status(500).send("Failed to update the procedure of the admission");
  }
});

doctorRouter.put("/:id/diagnosis", async (req, res) => {
  try {
    const doctorID = req.params.id;
    const { admissionID, diagnosis } = req.body;

    await updatePatientDiagnosis(admissionID, diagnosis);
    const patients = await getPatientsOfDoctor(doctorID);

    res.send(patients);
  } catch (err) {
    console.error("Error updating the diagnosis of the admission", err);
    res.status(500).send("Failed to update the diagnosis of the admission");
  }
});

doctorRouter.put("/:id/discharge", async (req, res) => {
  try {
    const doctorID = req.params.id;
    const { admissionID } = req.body;

    await updatePatientDischarge(admissionID);
    const patients = await getPatientsOfDoctor(doctorID);

    res.send(patients);
  } catch (err) {
    console.error("Error updating the discharge date of the admission", err);
    res
      .status(500)
      .send("Failed to update the discharge date of the admissionadmission");
  }
});

export default doctorRouter;
