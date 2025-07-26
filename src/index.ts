import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { config } from "./config.js";
import { logger } from "./lib/logger.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import projectsRouter from "./api/projects/project.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", //replace later with frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

app.use("/project", projectsRouter);

app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(error.stack);
  if (error.message === "notfound") {
    res.status(404).json({ error: "Searched resource not found" });
  } else if (error.message === "notAuthenticated") {
    res.status(401).json({ error: "Not authenticated" });
  } else {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

app.listen(config.api.port, () => {
  logger.info(`Server listening on port ${config.api.port}`);
});
