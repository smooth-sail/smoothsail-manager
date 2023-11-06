import "dotenv/config";
import appRoot from "app-root-path";
import { createLogger, format, transports } from "winston";
const { combine, colorize, timestamp, label, printf } = format;

const options = {
  file: {
    level: process.env.LOGLEVEL || "warn",
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: format.combine(format.timestamp(), format.json()),
  },
  console: {
    format: combine(
      colorize(),
      timestamp(),
      label({ label: "Manager API" }),
      printf(
        (params) =>
          `${new Date().toTimeString()} - ${params.level}: ${params.message}`
      )
    ),
    level: process.env.LOGLEVEL || "warn",
    defaultMeta: { service: "user-service" },
    handleExceptions: true,
  },
};
const logger = createLogger({
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console),
  ],
  exitOnError: false,
});
logger.stream = {
  write: function (message, encoding) {
    logger.info(message);
  },
};

export default logger;
