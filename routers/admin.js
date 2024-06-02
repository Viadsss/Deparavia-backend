import { Router } from "express";
import bcrypt, { hash } from "bcrypt";
import { createDoctor, getDoctors, getPatients } from "../database.js";

const adminRouter = Router();

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

adminRouter.post("/doctor", async (req, res) => {
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
