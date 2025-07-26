import express from "express";
const router = express.Router();

// GET /projects
router.get("/", (req, res, next) => {
  try {
    res.status(200).json({ message: "project route" });
  } catch (error) {
    next(error);
  }
});

export default router;
