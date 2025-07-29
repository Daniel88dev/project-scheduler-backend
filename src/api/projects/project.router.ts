import express from "express";
import {
  deleteProjectController,
  getAllProjects,
  getProjectById,
  postProject,
  postUsersToProject,
  putProject,
} from "./project.controller.js";
const projectRoutes_v1 = express.Router();

// GET /project/:projectId
projectRoutes_v1.get("/:projectId", getProjectById);

// GET /project
projectRoutes_v1.get("/", getAllProjects);

// POST /project
projectRoutes_v1.post("/", postProject);

projectRoutes_v1.put("/:projectId", putProject);

//projectRoutes_v1.post("/:projectId/milestones");

//projectRoutes_v1.get("/:projectId/milestones");

projectRoutes_v1.delete("/:projectId", deleteProjectController);

projectRoutes_v1.post("/:projectId/users", postUsersToProject);

export default projectRoutes_v1;
