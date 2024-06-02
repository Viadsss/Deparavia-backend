import { Router } from "express";
import bcrypt, { hash } from "bcrypt";
import {
  createDoctor,
  deleteAdmission,
  getAdmissions,
  getDoctors,
  getPatients,
  updateAdmissionDoctor,
  updateDoctorShift,
} from "../database.js";

const adminRouter = Router();

// Admissions
adminRouter.get("/admissions", async (req, res) => {
  try {
    const admissions = await getAdmissions();
    res.send(admissions);
  } catch (err) {
    console.error("Error fetching all admissions", err);
    res.status(500).send("Failed to fetch all admissions");
  }
});

adminRouter.put("/admissions/:id", async (req, res) => {
  try {
    const admissionID = req.params.id;
    const { doctorID } = req.body;

    await updateAdmissionDoctor(admissionID, doctorID);
    res.send("Admission doctor updated successfully");
  } catch (err) {
    console.error("Error updating the admission doctor", err);
    res.status(500).send("Failed to update admission doctor");
  }
});

adminRouter.delete("/admissions/:id", async (req, res) => {
  try {
    const admissionID = req.params.id;
    await deleteAdmission(admissionID);

    res.send("Admission deleted successfully");
  } catch (err) {
    console.error("Error deleting the admission", err);
    res.status(500).send("Failed to delete admission");
  }
});

// Doctors
adminRouter.get("/doctors", async (req, res) => {
  try {
    const doctors = await getDoctors();
    res.send(doctors);
  } catch (err) {
    console.error("Error fetching all doctors", err);
    res.status(500).send("Failed to fetch all doctors");
  }
});

adminRouter.post("/doctors", async (req, res) => {
  try {
    const { doctorName, doctorStartTime, doctorEndTime, doctorPassword } =
      req.body;

    const hashPassword = await bcrypt.hash(doctorPassword, 13);

    await createDoctor(
      doctorName,
      doctorStartTime,
      doctorEndTime,
      hashPassword
    );

    res.send("Doctor created successfully");
  } catch (err) {
    console.error("Error creating new doctor", err);
    res.status(500).send("Failed to create new doctor");
  }
});

adminRouter.put("/doctors/:id", async (req, res) => {
  try {
    const doctorID = req.params.id;
    const { doctorStartTime, doctorEndTime } = req.body;

    await updateDoctorShift(doctorID, doctorStartTime, doctorEndTime);
    res.send("Doctor shift updated successfully");
  } catch (err) {
    console.error("Error updating doctor shift", err);
    res.status(500).send("Failed to update doctor shift");
  }
});

// Patients
adminRouter.get("/patients", async (req, res) => {
  try {
    const patients = await getPatients();
    res.send(patients);
  } catch (err) {
    console.error("Error fetching all patients", err);
    res.status(500).send("Failed to fetch all patients");
  }
});

export default adminRouter;
