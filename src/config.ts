import dotenv from "dotenv";
dotenv.config({ quiet: true });

type Config = {
  api: APIConfig;
  db: DBConfig;
};

type APIConfig = {
  port: number;
};

type AWSDBConfig = {
  database: string | undefined;
  secret_arn: string | undefined;
  resources_arn: string | undefined;
};

type DBConfig = {
  database: string;
};

// process.loadEnvFile();

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export const config: Config = {
  api: {
    port: Number(envOrThrow("PORT")),
  },
  db: {
    database: envOrThrow("DATABASE"),
  },
};
