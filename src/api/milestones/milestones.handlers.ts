import { db } from "../../db/db.js";
import {
  projectMilestone,
  ProjectMilestoneInsertType,
  ProjectMilestoneType,
} from "../../db/schema.js";
import { eq } from "drizzle-orm";

export const selectMilestoneById = async (
  milestoneId: string
): Promise<ProjectMilestoneType> => {
  const milestones = await db
    .select()
    .from(projectMilestone)
    .where(eq(projectMilestone.id, milestoneId));

  return milestones[0];
};

export const updateMilestoneById = async (
  milestoneId: string,
  milestone: Omit<ProjectMilestoneInsertType, "id" | "projectId">
): Promise<ProjectMilestoneType> => {
  const updatedMilestone = await db
    .update(projectMilestone)
    .set({ ...milestone, updatedAt: new Date() })
    .where(eq(projectMilestone.id, milestoneId))
    .returning();

  return updatedMilestone[0];
};

export const deleteMilestoneById = async (milestoneId: string) => {
  return db
    .delete(projectMilestone)
    .where(eq(projectMilestone.id, milestoneId));
};
