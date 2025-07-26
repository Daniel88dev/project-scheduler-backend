import { db } from "../../db/db.js";
import { project, type ProjectType, projectUser } from "../../db/schema.js";
import { eq } from "drizzle-orm";

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
