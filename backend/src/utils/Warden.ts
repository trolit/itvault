/* eslint-disable @typescript-eslint/no-explicit-any */

import "winston-daily-rotate-file";
import { Logger, addColors, createLogger, format, transports } from "winston";

import { APP } from "@config";

const { IS_PRODUCTION } = APP;

type Service = "TypeORM" | "";

const ERRORS_TRANSPORT = new transports.DailyRotateFile({
  level: "error",
  filename: "logs/errors/%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
});

export class Warden {
  private _debugLogger: Logger;
  private _errorsLogger: Logger;

  public static start() {
    const warden = new this();

    warden._init();

    global.log = warden;
  }

  private _init() {
    if (this._debugLogger || this._errorsLogger) {
      console.log("Warden is already initialized!!");

      return;
    }

    addColors({
      info: "blue",
      warn: "yellow",
      error: "inverse red",
      debug: "green",
    });

    this._errorsLogger = createLogger({
      level: "info",
      format: format.combine(format.splat(), format.json()),
      exceptionHandlers: [
        new transports.File({ filename: "logs/exceptions.log" }),
      ],
      transports: [ERRORS_TRANSPORT],
      exitOnError: false,
    });

    this._debugLogger = createLogger({
      level: "debug",
      format: format.combine(
        format.splat(),
        format.timestamp({
          format: "DD.MM.YY HH:mm:ss",
        }),
        format.simple(),
        format.printf(msg =>
          format
            .colorize()
            .colorize(
              msg.level,
              `[${msg.timestamp}] [${msg.level.toUpperCase()}]${
                msg.service ? ` [${msg.service}]:` : ":"
              } ${msg.message}`
            )
        )
      ),
      transports: [
        new transports.Console({
          level: IS_PRODUCTION ? "info" : "debug",
        }),
      ],
    });
  }

  warning(arg: { service?: Service; message: string; values?: any[] }) {
    const { message, values, service } = arg;

    this._log({
      level: "warn",
      loggers: [this._debugLogger],
      labels: { service },
      message,
      values,
    });
  }

  info(arg: { service?: Service; message: string; values?: any[] }) {
    const { message, values, service } = arg;

    this._log({
      level: "info",
      loggers: [this._debugLogger],
      labels: { service },
      message,
      values,
    });
  }

  error(arg: {
    service?: Service;
    message: string;
    error?: any;
    values?: any[];
  }) {
    const { message, values, service, error } = arg;

    this._log({
      level: "error",
      loggers: [this._errorsLogger, this._debugLogger],
      labels: { service },
      message,
      values,
      additionalData: {
        error: error.stack,
      },
    });
  }

  debug(arg: { service?: Service; message: string; values?: any[] }) {
    const { message, values, service } = arg;

    this._log({
      level: "debug",
      loggers: [this._debugLogger],
      labels: { service },
      message,
      values,
    });
  }

  private _log<T = void>(arg: {
    level: string;
    loggers: Logger[];
    message: string;

    values?: any[];
    labels?: {
      service?: string;
    };
    additionalData?: T;
  }) {
    const { loggers, level, message, values, labels, additionalData } = arg;

    const interpolation = values ? values : [];

    for (const logger of loggers) {
      logger.log(level, message, ...interpolation, {
        ...labels,
        ...additionalData,
      });
    }
  }
}
