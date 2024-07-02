import { Router } from "express";
import bcrypt from "bcrypt";
import {
  createDoctor,
  getAdmissions,
  getDoctors,
  getPatients,
  updateAdmissionDoctor,
  getVisitors,
  getPatientsTotal,
  getAdmissionsNoDoctor,
  getAdmissionsNotDischarge,
  getAdmissionsTotal,
  getAdmissionsNoDoctorTotal,
  getAdmissionsNotDischargeTotal,
  getVisitorsTotal,
  getDoctorsTotal,
  getDailyAdmissionsCurrentMonth,
  getMonthlyAdmissionsCurrentYear,
  getDailyVisitorsCurrentMonth,
  getMonthlyVisitorsCurrentYear,
  deleteMultipleVisitor,
  deleteVisitor,
  deleteVisitorPastMonth,
  deleteVisitorPastThreeMonths,
  deleteVisitorPastSixMonths,
  deleteVisitorPastYear,
  deleteVisitors,
  updateDoctorDetails,
  getActiveDoctorsOnDuty,
  getActiveDoctorsOffDuty,
  getInactiveDoctors,
  getDoctorsOnLeave,
  getActiveDoctors,
  getActiveDoctorsOnDutyTotal,
  getActiveDoctorsOffDutyTotal,
  getActiveDoctorsTotal,
  getInactiveDoctorsTotal,
  getDoctorsOnLeaveTotal,
} from "../database/database.js";

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

adminRouter.get("/admissions/noDoctor", async (req, res) => {
  try {
    const admissions = await getAdmissionsNoDoctor();
    res.send(admissions);
  } catch (err) {
    console.error("Error fetching all admissions with no doctors", err);
    res.status(500).send("Failed to fetch all admissions with no doctors");
  }
});

adminRouter.get("/admissions/notDischarge", async (req, res) => {
  try {
    const admissions = await getAdmissionsNotDischarge();
    res.send(admissions);
  } catch (err) {
    console.error(
      "Error fetching all admissions that is not yet discharged",
      err
    );
    res
      .status(500)
      .send("Failed to fetch all admissions that is not yet discharged");
  }
});

adminRouter.get("/admissions/month", async (req, res) => {
  try {
    const totalAdmissionsPerDay = await getDailyAdmissionsCurrentMonth();
    res.send(totalAdmissionsPerDay);
  } catch (err) {
    console.error("Error fetching the total admissions per day for this month");
    res
      .status(500)
      .send("Failed to fetch the total admissions per day for this month");
  }
});

adminRouter.get("/visitors/month", async (req, res) => {
  try {
    const totalVisitorsPerDay = await getDailyVisitorsCurrentMonth();
    res.send(totalVisitorsPerDay);
  } catch (err) {
    console.error("Error fetching the total visitors per day for this month");
    res
      .status(500)
      .send("Failed to fetch the total visitors per day for this month");
  }
});

adminRouter.get("/admissions/year", async (req, res) => {
  try {
    const totalAdmissionsPerMonth = await getMonthlyAdmissionsCurrentYear();
    res.send(totalAdmissionsPerMonth);
  } catch (err) {
    console.error(
      "Error fetching the total admissions per month for this year"
    );
    res
      .status(500)
      .send("Failed to fetch the total admissions per month for this year");
  }
});

adminRouter.get("/visitors/year", async (req, res) => {
  try {
    const totalVisitorsPerMonth = await getMonthlyVisitorsCurrentYear();
    res.send(totalVisitorsPerMonth);
  } catch (err) {
    console.error("Error fetching the total visitors per month for this year");
    res
      .status(500)
      .send("Failed to fetch the total visitors per month for this year");
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

adminRouter.get("/doctors/onDuty", async (req, res) => {
  try {
    const doctorsOnDuty = await getActiveDoctorsOnDuty();
    res.send(doctorsOnDuty);
  } catch (err) {
    console.error("Error fetching active doctors on duty", err);
    res.status(500).send("Failed to fetch active doctors on duty");
  }
});

adminRouter.get("/doctors/offDuty", async (req, res) => {
  try {
    const doctorsOffDuty = await getActiveDoctorsOffDuty();
    res.send(doctorsOffDuty);
  } catch (err) {
    console.error("Error fetching active doctors off duty", err);
    res.status(500).send("Failed to fetch active doctors off duty");
  }
});

adminRouter.get("/doctors/active", async (req, res) => {
  try {
    const activeDoctors = await getActiveDoctors();
    res.send(activeDoctors);
  } catch (err) {
    console.error("Error fetching active doctors", err);
    res.status(500).send("Failed to fetch active doctors");
  }
});

adminRouter.get("/doctors/inactive", async (req, res) => {
  try {
    const inactiveDoctors = await getInactiveDoctors();
    res.send(inactiveDoctors);
  } catch (err) {
    console.error("Error fetching inactive doctors", err);
    res.status(500).send("Failed to fetch inactive doctors");
  }
});

adminRouter.get("/doctors/onLeave", async (req, res) => {
  try {
    const doctorsOnLeave = await getDoctorsOnLeave();
    res.send(doctorsOnLeave);
  } catch (err) {
    console.error("Error fetching doctors on leave", err);
    res.status(500).send("Failed to fetch doctors on leave");
  }
});

adminRouter.post("/doctors", async (req, res) => {
  try {
    const {
      doctorName,
      doctorStartTime,
      doctorEndTime,
      doctorStatus,
      doctorPassword,
    } = req.body;

    const hashPassword = await bcrypt.hash(doctorPassword, 13);

    await createDoctor(
      doctorName,
      doctorStartTime,
      doctorEndTime,
      doctorStatus,
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
    const { doctorStartTime, doctorEndTime, doctorStatus } = req.body;

    await updateDoctorDetails(
      doctorID,
      doctorStartTime,
      doctorEndTime,
      doctorStatus
    );
    res.send("Doctor details updated successfully");
  } catch (err) {
    console.error("Error updating doctor details", err);
    res.status(500).send("Failed to update doctor details");
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

adminRouter.delete("/visitors", async (req, res) => {
  try {
    await deleteVisitors();
    res.send("All visitors deleted successfully");
  } catch (err) {
    console.error("Error deleting all visitors", err);
    res.status(500).send("Failed to delete all visitors");
  }
});

adminRouter.delete("/visitors/multiple", async (req, res) => {
  try {
    const { visitorIDs } = req.body;
    await deleteMultipleVisitor(visitorIDs);
    res.send("Multiple Visitors deleted successfully");
  } catch (err) {
    console.error("Error deleting multiple visitors");
    res.status(500).send("Failed to delete multiple visitors");
  }
});

adminRouter.delete("/visitors/:id", async (req, res) => {
  try {
    const visitorID = req.params.id;
    await deleteVisitor(visitorID);

    res.send("Visitor deleted successfully");
  } catch (err) {
    console.error("Error deleting the visitor", err);
    res.status(500).send("Failed to delete visitor");
  }
});

adminRouter.delete("/visitors/time/:deleteTime", async (req, res) => {
  try {
    const deleteTime = req.params.deleteTime;

    switch (deleteTime) {
      case "1month":
        await deleteVisitorPastMonth();
        break;
      case "3month":
        await deleteVisitorPastThreeMonths();
        break;
      case "6month":
        await deleteVisitorPastSixMonths();
        break;
      case "1year":
        await deleteVisitorPastYear();
        break;
      default:
        res.status(400).send("Invalid delete time specified");
        return;
    }
    res.send(
      `Visitors from the past ${deleteTime} have been deleted successfully`
    );
  } catch (err) {
    console.error(`Error deleting visitors from past ${deleteTime}`, err);
    res.status(500).send(`Failed to delete visitors from past ${deleteTime}`);
  }
});

// TODO: Admission Total
adminRouter.get("/admissions/total", async (req, res) => {
  try {
    const total = await getAdmissionsTotal();
    res.send(total);
  } catch (err) {
    console.error("Error fetching the admission total", err);
    res.status(500).send("Failed to fetch admission total");
  }
});

adminRouter.get("/admissions/noDoctor/total", async (req, res) => {
  try {
    const total = await getAdmissionsNoDoctorTotal();
    res.send(total);
  } catch (err) {
    console.error("Error fetching the admissions with no doctor total", err);
    res.status(500).send("Failed to fetch admission with no doctor total");
  }
});

adminRouter.get("/admissions/notDischarge/total", async (req, res) => {
  try {
    const total = await getAdmissionsNotDischargeTotal();
    res.send(total);
  } catch (err) {
    console.error(
      "Error fetching the admissions not discharged yet total",
      err
    );
    res.status(500).send("Failed to fetch admission not discharged yet total");
  }
});

// Doctors
adminRouter.get("/doctors/total", async (req, res) => {
  try {
    const total = await getDoctorsTotal();
    res.send(total);
  } catch (err) {
    console.error("Error fetching the doctor total", err);
    res.status(500).send("Failed to fetch doctor total");
  }
});

adminRouter.get("/doctors/onDuty/total", async (req, res) => {
  try {
    const total = await getActiveDoctorsOnDutyTotal();
    res.send(total);
  } catch (err) {
    console.error("Error fetching the total of doctors on duty", err);
    res.status(500).send("Failed to fetch total of doctors on duty");
  }
});

adminRouter.get("/doctors/offDuty/total", async (req, res) => {
  try {
    const total = await getActiveDoctorsOffDutyTotal();
    res.send(total);
  } catch (err) {
    console.error("Error fetching the total of doctors off duty", err);
    res.status(500).send("Failed to fetch total of doctors off duty");
  }
});

adminRouter.get("/doctors/active/total", async (req, res) => {
  try {
    const total = await getActiveDoctorsTotal();
    res.send(total);
  } catch (err) {
    console.error("Error fetching the total of active doctors", err);
    res.status(500).send("Failed to fetch total of active doctors");
  }
});

adminRouter.get("/doctors/inactive/total", async (req, res) => {
  try {
    const total = await getInactiveDoctorsTotal();
    res.send(total);
  } catch (err) {
    console.error("Error fetching the total of inactive doctors", err);
    res.status(500).send("Failed to fetch total of inactive doctors");
  }
});

adminRouter.get("/doctors/onLeave/total", async (req, res) => {
  try {
    const total = await getDoctorsOnLeaveTotal();
    res.send(total);
  } catch (err) {
    console.error("Error fetching the total of doctors on leave", err);
    res.status(500).send("Failed to fetch total of doctors on leave");
  }
});

adminRouter.get("/patients/total", async (req, res) => {
  try {
    const total = await getPatientsTotal();
    res.send(total);
  } catch (err) {
    console.error("Error fetching the patient total", err);
    res.status(500).send("Failed to fetch patient total");
  }
});

adminRouter.get("/visitors/total", async (req, res) => {
  try {
    const total = await getVisitorsTotal();
    res.send(total);
  } catch (err) {
    console.error("Error fetching the visitor total", err);
    res.status(500).send("Failed to fetch visitor total");
  }
});

export default adminRouter;
