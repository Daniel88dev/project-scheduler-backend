import express from "express";
import { toNodeHandler } from "better-auth/node";
import { config } from "./config.js";
import { logger } from "./lib/logger.js";
import { auth } from "./lib/auth.js";
import projectsRouter_v1 from "./api/projects/project.router.js";
import milestonesRouter_v1 from "./api/milestones/milestones.router.js";
import { limiter } from "./lib/limiter.js";
import { serverCors } from "./lib/cors.js";
import { helmetHeaders } from "./lib/headers.js";
import { errorMiddleware } from "./lib/errorMiddleware.js";

const app = express();

app.use(serverCors);

app.use(helmetHeaders);

// rate limiting - can be removed from global middleware, and added only to specific route
app.use(limiter);

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

app.use("/project", projectsRouter_v1);
app.use("/milestones", milestonesRouter_v1);

app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(errorMiddleware);

app.listen(config.api.port, () => {
  logger.info(`Server listening on port ${config.api.port}`);
});
