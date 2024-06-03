import { Router } from "express";
import { createVisitor, getPatient } from "../database.js";

const visitorRouter = Router();

visitorRouter.post("/", async (req, res) => {
  try {
    const {
      patientID,
      visitorName,
      visitorRelationship,
      visitorContactNumber,
    } = req.body;

    const patient = await getPatient(patientID);
    if (!patient)
      return res.status(401).send({
        title: "Patient ID does not exist.",
        description: "The patient id you input does not exist in our system",
      });

    await createVisitor(
      patientID,
      visitorName,
      visitorRelationship,
      visitorContactNumber
    );

    res.send({
      title: "Visitor Added",
      description: "The visitor has been successfully added.",
    });
  } catch (err) {
    console.error("Error adding visitor to the patient", err);
    res.status(500).send({
      title: "Failed to Add Visitor",
      description: "There was an error adding the visitor. Please try again.",
    });
  }
});

export default visitorRouter;
