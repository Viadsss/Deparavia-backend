import { Router } from "express";
import bcrypt from "bcrypt";
import {
  createDoctor,
  deleteAdmission,
  getAdmissions,
  getDoctors,
  getPatients,
  updateAdmissionDoctor,
  updateDoctorShift,
  getVisitors,
  getPatientsTotal,
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

adminRouter.put("/patients/:id", async (req, res) => {
  try {
    const patientId = req.params.id;
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
      emergencyContactName,
      emergencyContactRelationship,
      emergencyContactNumber,
    } = req.body;

    await updatePatientDetails(patientId, {
      height,
      weight,
      maritalStatus,
      contactNumber,
      emailAddress,
      streetAddress,
      city,
      province,
      zipCode,
      emergencyContactName,
      emergencyContactRelationship,
      emergencyContactNumber,
    });

    res.send("Patient details updated successfully");
  } catch (err) {
    console.error("Error updating patient details", err);
    res.status(500).send("Failed to update patient details");
  }
});

adminRouter.put("/patients/:id/password", async (req, res) => {
  try {
    const patientID = req.params.id;
    const { originalPassword, newPassword } = req.body;

    const patient = await getPatient(patientID);
    if (!patient) {
      return res.status(404).send("Patient not found");
    }

    const isMatch = await bcrypt.compare(
      originalPassword,
      patient.patientPassword
    );
    if (!isMatch) {
      return res.status(401).send("Incorrect original password");
    }

    const hashPassword = await bcrypt.hash(newPassword, 13);

    await updatePatientPassword(patientID, hashPassword);
    res.send("Password successfully changed");
  } catch (err) {
    console.error("Error updating the password of patient", err);
    res.status(500).send("Failed to update the password of patient");
  }
});

// Visitors
adminRouter.get("/visitors", async (req, res) => {
  try {
    const visitors = await getVisitors();
    res.send(visitors);
  } catch (err) {
    console.error("Error fetching all visitors", err);
    res.status(500).send("Failed to fetch all visitors");
  }
});

// Total Rows

// TODO: Admission Total
adminRouter.get("/admissions/total", async (req, res) => {});
// TODO: Doctor Total
adminRouter.get("/doctors/total", async (req, res) => {});

adminRouter.get("/patients/total", async (req, res) => {
  try {
    const patientTotal = await getPatientsTotal();
    res.send(patientTotal);
  } catch (err) {
    console.error("Error fetching the patient total", err);
    res.status(500).send("Failed to fetch patient total");
  }
});

// TODO: Visitor Total
adminRouter.get("/visitors/total", async (req, res) => {});

export default adminRouter;
