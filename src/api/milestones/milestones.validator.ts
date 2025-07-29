import { z } from "zod";

export const MilestoneIdValidator = z.object({
  milestoneId: z.uuidv4(),
});

export const MilestoneInsertValidator = z.object({
  name: z.string().min(3).trim().normalize(),
  description: z.string().trim(),
  startDate: z.preprocess((val) => new Date(val as string), z.date()),
  endDate: z.preprocess((val) => new Date(val as string), z.date()),
  assignedTo: z.string().optional(),
  completed: z.boolean().optional(),
});
