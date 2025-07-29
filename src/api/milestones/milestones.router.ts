import express from "express";
import {
  deleteMilestoneByIdController,
  getMilestoneById,
  putMilestone,
} from "./milestones.controller.js";

const milestonesRouter_v1 = express.Router();

milestonesRouter_v1.get("/:milestoneId", getMilestoneById);

milestonesRouter_v1.put("/:milestoneId", putMilestone);

milestonesRouter_v1.delete("/:milestoneId", deleteMilestoneByIdController);

export default milestonesRouter_v1;
