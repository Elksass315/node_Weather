import winston from "winston";
import "express-async-errors";
import config from "config";

export default () => {
    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: config.get("logFile") }));
}