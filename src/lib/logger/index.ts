import path from "path";
import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: "info",
  exitOnError: false,
  format: format.json(),
  transports: [
    process.env.ENVIRONMENT === "DEVELOPMENT"
      ? new transports.Console()
      : new transports.File({ filename: path.join("./", "/logs/log.log") }),
  ],
});
