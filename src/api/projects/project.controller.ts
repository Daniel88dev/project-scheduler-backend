import { NextFunction, Request, Response } from "express";
import { protectedRoute } from "../auth/auth.controller.js";
import { selectAllProjects } from "./project.handlers.js";

export const getAllProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await protectedRoute(req);

    const projects = await selectAllProjects(session.user.id);
    if (!projects) {
      throw new Error("notfound");
    }

    if (projects.length === 0) {
      return res.status(204).json({ message: "No projects found" });
    }

    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};
