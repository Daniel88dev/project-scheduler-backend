import express from "express";
import { config } from "./config.js";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(config.api.port, () => {
  console.log(`Server listening on port ${config.api.port}`);
});
