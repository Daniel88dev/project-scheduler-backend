import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";
import { config } from "../config.js";

export const db = drizzle({
  connection: {
    connectionString: config.db.database,
  },
  schema,
});
