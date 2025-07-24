import express, { NextFunction, Request, Response } from "express";
import { config } from "./config.js";
import { createLogger, format, transports } from "winston";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

const app = express();

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
  ],
});

app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(error.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(config.api.port, () => {
  logger.info(`Server listening on port ${config.api.port}`);
});
