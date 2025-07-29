import { useValidate } from "../../lib/validateData.js";
import { authValidator } from "../auth/auth.controller.js";
import {
  MilestoneIdValidator,
  MilestoneInsertValidator,
} from "./milestones.validator.js";
import {
  deleteMilestoneById,
  selectMilestoneById,
  updateMilestoneById,
} from "./milestones.handlers.js";

export const getMilestoneById = useValidate(
  {
    auth: authValidator,
    params: MilestoneIdValidator,
  },
  async (req, res, next) => {
    try {
      const milestoneId = req.params.milestoneId;
      const session = req.session;

      //TODO add access validation

      const milestoneData = await selectMilestoneById(milestoneId);

      if (!milestoneData) {
        res.status(204).json({ message: "No milestones found" });
      }
      res.status(200).json(milestoneData);
    } catch (error) {
      next(error);
    }
  }
);

export const putMilestone = useValidate(
  {
    auth: authValidator,
    params: MilestoneIdValidator,
    body: MilestoneInsertValidator,
  },
  async (req, res, next) => {
    try {
      const milestoneId = req.params.milestoneId;
      const session = req.session;
      const milestone = req.body!;

      //TODO add access validation

      const updateMilestone = await updateMilestoneById(milestoneId, {
        ...milestone,
      });
      if (!updateMilestone) {
        throw new Error("dbError", { cause: updateMilestone });
      }

      res.status(200).json(updateMilestone);
    } catch (error) {
      next(error);
    }
  }
);

export const deleteMilestoneByIdController = useValidate(
  {
    auth: authValidator,
    params: MilestoneIdValidator,
  },
  async (req, res, next) => {
    try {
      const milestoneId = req.params.milestoneId;
      const session = req.session;

      //TODO add access validation

      await deleteMilestoneById(milestoneId);

      res.status(200).json({ message: "Milestone deleted" });
    } catch (error) {
      next(error);
    }
  }
);
