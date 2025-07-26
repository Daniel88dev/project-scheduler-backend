import cors from "cors";

export const serverCors = cors({
  origin: "http://localhost:3000", //replace later with frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});
