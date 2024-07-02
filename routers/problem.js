import { Router } from "express";
import { getProblem4 } from "../database/problems.js";

const problemRouter = Router();

problemRouter.get("/4", async (req, res) => {
  try {
    const output = await getProblem4();
    res.send(output);
  } catch (err) {
    console.error("Error fetching Problem 4 Output", err);
    res.status(500).send("Failed to fetch Problem 4 Output");
  }
});

export default problemRouter;
