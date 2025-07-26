import express from "express";
import { getAllProjects } from "./project.controller.js";
const router = express.Router();

// GET /projects
router.get("/", getAllProjects);

export default router;
