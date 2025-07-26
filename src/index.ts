import express, { NextFunction, Request, Response } from "express";
import { config } from "./config.js";
import { logger } from "./lib/logger.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import projectsRouter from "./routes/projectsRouter.js";

const app = express();

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

app.use("/projects", projectsRouter);

app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(error.stack);
  if (error.message === "notfound") {
    res.status(404).json({ error: "Searched resource not found" });
  } else {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

app.listen(config.api.port, () => {
  logger.info(`Server listening on port ${config.api.port}`);
});
