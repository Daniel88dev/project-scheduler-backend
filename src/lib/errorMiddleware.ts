import { NextFunction, Request, Response } from "express";
import { logger } from "./logger.js";

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(error.stack);
  switch (error.message) {
    case "notfound":
      res.status(404).json({ error: "Searched resource not found" });
      break;
    case "notAuthenticated":
      res.status(401).json({ error: "Not authenticated" });
      break;
    case "noAccess":
      res.status(403).json({ error: "You dont have access to this resource" });
      break;
    case "validator":
      res.status(400).json({ error: error.cause });
      break;
    default:
      res.status(500).json({ error: "Something went wrong!" });
  }
};
