import { authValidator, protectedRoute } from "../auth/auth.controller.js";
import {
  deleteProjectHandler,
  deleteUsersOfProject,
  insertProject,
  insertUserToProject,
  selectAllProjects,
  selectProjectById,
  updateProject,
  validateProjectEditAccess,
} from "./project.handlers.js";
import { idGenerate } from "../../lib/idGenerate.js";
import { ProjectInsertType, ProjectUserInsertType } from "../../db/schema.js";
import {
  ProjectIdValidator,
  ProjectInsertValidator,
  UserAddValidator,
} from "./project.validator.js";
import { useValidate } from "../../lib/validateData.js";

export const getAllProjects = useValidate(
  {
    auth: authValidator,
  },
  async (req, res, next) => {
    try {
      const session = req.session;

      const projects = await selectAllProjects(session.userId);
      if (!projects) {
        throw new Error("notfound");
      }

      if (projects.length === 0) {
        res.status(204).json({ message: "No projects found" });
      }
      res.status(200).json(projects);
    } catch (error) {
      next(error);
    }
  }
);

export const getProjectById = useValidate(
  {
    auth: authValidator,
    params: ProjectIdValidator,
  },
  async (req, res, next) => {
    try {
      const projectId = req.params.projectId;
      const session = req.session;

      const project = await selectProjectById(session.userId, projectId);

      if (!project) {
        res.status(204).json({ message: "No projects found" });
      }

      res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  }
);

export const postProject = useValidate(
  {
    body: ProjectInsertValidator,
    auth: authValidator,
  },
  async (req, res, next) => {
    try {
      const session = req.session;
      const projectData = req.body!;

      const project: ProjectInsertType = {
        ...projectData,
        createdBy: session.userId,
        id: idGenerate(),
      };

      const newProject = await insertProject(project);

      const userProjectData: ProjectUserInsertType = {
        id: idGenerate(),
        projectId: newProject.id,
        userId: session.userId,
      };

      await insertUserToProject(userProjectData);

      res.status(201).json(newProject);
    } catch (error) {
      next(error);
    }
  }
);

export const putProject = useValidate(
  {
    body: ProjectInsertValidator,
    params: ProjectIdValidator,
    auth: authValidator,
  },
  async (req, res, next) => {
    try {
      const projectId = req.params.projectId;
      const session = req.session;
      const project = req.body!;

      const validateAccess = await validateProjectEditAccess(
        projectId,
        session.userId
      );
      if (!validateAccess) {
        throw new Error("noAccess");
      }

      const projectUpdate = await updateProject(projectId, { ...project });
      if (!projectUpdate) {
        throw new Error("dbError", { cause: projectUpdate });
      }

      res.status(200).json(projectUpdate);
    } catch (error) {
      next(error);
    }
  }
);

export const deleteProjectController = useValidate(
  {
    auth: authValidator,
    params: ProjectIdValidator,
  },
  async (req, res, next) => {
    try {
      const projectId = req.params.projectId;
      const session = req.session;

      const validate = await validateProjectEditAccess(
        projectId,
        session.userId
      );
      if (!validate) {
        throw new Error("noAccess");
      }

      await deleteProjectHandler(projectId);

      res.status(200).json({ message: "Project deleted" });
    } catch (error) {
      next(error);
    }
  }
);

export const postUsersToProject = useValidate(
  {
    auth: authValidator,
    body: UserAddValidator,
    params: ProjectIdValidator,
  },
  async (req, res, next) => {
    try {
      const session = req.session;
      const userArray = req.body!;
      const projectId = req.params.projectId;

      const validate = await validateProjectEditAccess(
        projectId,
        session.userId
      );
      if (!validate) {
        throw new Error("noAccess");
      }

      for (let i = 0; i < userArray.users.length; i++) {
        const user = userArray.users[i];
        if (user.addAction) {
          const userProjectInsert = await insertUserToProject({
            id: idGenerate(),
            projectId: projectId,
            userId: user.userId,
          });
          if (!userProjectInsert) {
            throw new Error("dbError", { cause: userProjectInsert });
          }
        } else if (user.deleteAction) {
          await deleteUsersOfProject(projectId, user.userId);
        }
      }

      res.status(200).json({ message: "Users for project updated" });
    } catch (error) {
      next(error);
    }
  }
);
