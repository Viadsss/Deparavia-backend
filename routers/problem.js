import { Router } from "express";
import {
  getProblem1,
  getProblem2,
  getProblem3,
  getProblem4,
  getProblem5,
  getProblem6,
  getProblem7,
  getProblem8,
  getProblem9,
  getProblem10,
} from "../database/problems.js";

const problemRouter = Router();

problemRouter.get("/1", async (req, res) => {
  try {
    const output = await getProblem1();
    res.send(output);
  } catch (err) {
    console.error("Error fetching Problem 1 Output", err);
    res.status(500).send("Failed to fetch Problem 1 Output");
  }
});

problemRouter.get("/2", async (req, res) => {
  try {
    const output = await getProblem2();
    res.send(output);
  } catch (err) {
    console.error("Error fetching Problem 2 Output", err);
    res.status(500).send("Failed to fetch Problem 2 Output");
  }
});

problemRouter.get("/3", async (req, res) => {
  try {
    const output = await getProblem3();
    res.send(output);
  } catch (err) {
    console.error("Error fetching Problem 4 Output", err);
    res.status(500).send("Failed to fetch Problem 4 Output");
  }
});

problemRouter.get("/4", async (req, res) => {
  try {
    const output = await getProblem4();
    res.send(output);
  } catch (err) {
    console.error("Error fetching Problem 4 Output", err);
    res.status(500).send("Failed to fetch Problem 4 Output");
  }
});

problemRouter.get("/5", async (req, res) => {
  try {
    const output = await getProblem5();
    res.send(output);
  } catch (err) {
    console.error("Error fetching Problem 5 Output", err);
    res.status(500).send("Failed to fetch Problem 5 Output");
  }
});

problemRouter.get("/6", async (req, res) => {
  try {
    const output = await getProblem6();
    res.send(output);
  } catch (err) {
    console.error("Error fetching Problem 6 Output", err);
    res.status(500).send("Failed to fetch Problem 6 Output");
  }
});

problemRouter.get("/7", async (req, res) => {
  try {
    const output = await getProblem7();
    res.send(output);
  } catch (err) {
    console.error("Error fetching Problem 7 Output", err);
    res.status(500).send("Failed to fetch Problem 7 Output");
  }
});

problemRouter.get("/8", async (req, res) => {
  try {
    const output = await getProblem8();
    res.send(output);
  } catch (err) {
    console.error("Error fetching Problem 8 Output", err);
    res.status(500).send("Failed to fetch Problem 8 Output");
  }
});

problemRouter.get("/9", async (req, res) => {
  try {
    const output = await getProblem9();
    res.send(output);
  } catch (err) {
    console.error("Error fetching Problem 9 Output", err);
    res.status(500).send("Failed to fetch Problem 9 Output");
  }
});

problemRouter.get("/10", async (req, res) => {
  try {
    const output = await getProblem10();
    res.send(output);
  } catch (err) {
    console.error("Error fetching Problem 10 Output", err);
    res.status(500).send("Failed to fetch Problem 10 Output");
  }
});

export default problemRouter;
