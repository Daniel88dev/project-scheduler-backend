import { db } from "../../db/db.js";
import {
  project,
  ProjectInsertType,
  type ProjectType,
  projectUser,
  ProjectUserInsertType,
  ProjectUserType,
} from "../../db/schema.js";
import { and, eq } from "drizzle-orm";

export const selectAllProjects = async (
  userId: string
): Promise<ProjectType[]> => {
  return db
    .select({
      id: project.id,
      title: project.title,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      createdBy: project.createdBy,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    })
    .from(project)
    .leftJoin(projectUser, eq(projectUser.projectId, project.id))
    .where(eq(projectUser.userId, userId));
};

export const selectProjectById = async (
  userId: string,
  projectId: string
): Promise<ProjectType> => {
  const projectData = await db
    .select({
      id: project.id,
      title: project.title,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      createdBy: project.createdBy,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    })
    .from(project)
    .leftJoin(projectUser, eq(projectUser.projectId, project.id))
    .where(and(eq(project.id, projectId), eq(projectUser.userId, userId)));

  return projectData[0];
};

export const insertProject = async (
  projectData: ProjectInsertType
): Promise<ProjectType> => {
  const projectReturned = await db
    .insert(project)
    .values(projectData)
    .returning();
  return projectReturned[0];
};

export const updateProject = async (
  projectId: string,
  projectData: Omit<ProjectInsertType, "id" | "createdBy">
): Promise<ProjectType> => {
  const projectReturned = await db
    .update(project)
    .set(projectData)
    .where(eq(project.id, projectId))
    .returning();
  return projectReturned[0];
};

export const validateProjectEditAccess = async (
  projectId: string,
  userId: string
): Promise<boolean> => {
  const check = await db
    .select()
    .from(projectUser)
    .where(
      and(eq(projectUser.projectId, projectId), eq(projectUser.userId, userId))
    );

  return check.length === 1;
};

export const deleteProjectHandler = async (projectId: string) => {
  return db.delete(project).where(eq(project.id, projectId));
};

export const insertUserToProject = async (
  data: ProjectUserInsertType
): Promise<ProjectUserType> => {
  const result = await db.insert(projectUser).values(data).returning();

  return result[0];
};

export const deleteUsersOfProject = async (
  projectId: string,
  userId: string
) => {
  return db
    .delete(projectUser)
    .where(
      and(eq(projectUser.projectId, projectId), eq(projectUser.userId, userId))
    );
};
