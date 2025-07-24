import dotenv from "dotenv";
import * as process from "node:process";
dotenv.config();

type Config = {
  api: APIConfig;
};

type APIConfig = {
  port: string | undefined;
};

export const config: Config = {
  api: {
    port: process.env.PORT,
  },
};
