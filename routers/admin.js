import { Router } from "express";
import { getPatients } from "../database.js";

const adminRouter = Router();

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
