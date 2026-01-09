import { Logger } from "next-axiom";
import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

type LogPayload = {
  msg: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

const pinoLogger = pino({
  level: "debug",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss",
      ignore: "pid,hostname",
    },
  },
});

const axiomLogger = new Logger();

export const logger = {
  info: (obj: LogPayload) => {
    if (!isProd) {
      pinoLogger.info(obj);
    } else {
      const { msg, ...rest } = obj;
      axiomLogger.info(msg, rest);
    }
  },
  error: (obj: LogPayload) => {
    if (!isProd) {
      pinoLogger.error(obj);
    } else {
      const { msg, ...rest } = obj;
      axiomLogger.error(msg, rest);
    }
  },
  warn: (obj: LogPayload) => {
    if (!isProd) {
      pinoLogger.warn(obj);
    } else {
      const { msg, ...rest } = obj;
      axiomLogger.warn(msg, rest);
    }
  },
  debug: (obj: LogPayload) => {
    if (!isProd) {
      pinoLogger.debug(obj);
    } else {
      const { msg, ...rest } = obj;
      axiomLogger.debug(msg, rest);
    }
  },
  flush: async () => {
    if (isProd) await axiomLogger.flush();
  },
};
