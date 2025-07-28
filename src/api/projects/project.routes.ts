import express from "express";
import {
  deleteProjectController,
  getAllProjects,
  getProjectById,
  postProject,
  postUsersToProject,
  putProject,
} from "./project.controller.js";
import { validateData } from "../../lib/validateData.js";
import { UserAddValidator } from "./project.validator.js";
const router = express.Router();

// GET /project/:projectId
router.get("/:projectId", getProjectById);

// GET /project
router.get("/", getAllProjects);

// POST /project
router.post("/", postProject);

router.put("/:projectId", putProject);

router.delete("/:projectId", deleteProjectController);

router.post("/:projectId/users", postUsersToProject);

export default router;
