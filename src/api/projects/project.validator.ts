import { z } from "zod";

export const ProjectInsertValidator = z.object({
  title: z.string().min(3).trim().normalize(),
  description: z.string().trim(),
  startDate: z.preprocess((val) => new Date(val as string), z.date()),
  endDate: z.preprocess((val) => new Date(val as string), z.date()),
});

export const ProjectIdValidator = z.object({
  projectId: z.uuidv4(),
});

export const UserAddValidator = z.object({
  users: z.array(
    z.object({
      userId: z.string().min(1),
      addAction: z.boolean(),
      deleteAction: z.boolean(),
    })
  ),
});
