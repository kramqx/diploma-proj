import { Logger } from "next-axiom";
import pino from "pino";
import pretty from "pino-pretty";

import { requestContext } from "@/server/utils/request-context";
import { isProd } from "../constants/env";

type LogPayload = {
  msg: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

const createPinoLogger = () => {
  if (isProd) {
    return pino({ level: "info" });
  }

  const stream = pretty({
    colorize: true,
    translateTime: "HH:MM:ss",
    ignore: "pid,hostname",
    messageKey: "msg",
  });

  return pino(
    {
      level: "debug",
      base: undefined,
    },
    stream
  );
};

const pinoLogger = createPinoLogger();

const axiomLogger = isProd ? new Logger() : null;

const withContext = (obj: LogPayload) => {
  const store = requestContext.getStore();
  if (obj.error instanceof Error) {
    obj.error = {
      message: obj.error.message,
      stack: obj.error.stack,
      kind: obj.error.name,
    };
  }

  return {
    ...store,
    ...obj,
  };
};

export const logger = {
  info: (payload: LogPayload) => {
    const data = withContext(payload);
    if (isProd && axiomLogger) {
      axiomLogger.info(data.msg, data);
    } else {
      const { msg, ...rest } = data;
      pinoLogger.info(rest, msg);
    }
  },
  error: (payload: LogPayload) => {
    const data = withContext(payload);
    if (isProd && axiomLogger) {
      axiomLogger.error(data.msg, data);
    } else {
      const { msg, ...rest } = data;
      pinoLogger.error(rest, msg);
    }
  },
  warn: (payload: LogPayload) => {
    const data = withContext(payload);
    if (isProd && axiomLogger) {
      axiomLogger.warn(data.msg, data);
    } else {
      const { msg, ...rest } = data;
      pinoLogger.warn(rest, msg);
    }
  },
  debug: (payload: LogPayload) => {
    const data = withContext(payload);
    if (isProd && axiomLogger) {
      axiomLogger.debug(data.msg, data);
    } else {
      const { msg, ...rest } = data;
      pinoLogger.debug(rest, msg);
    }
  },
  flush: async () => {
    if (isProd && axiomLogger) await axiomLogger.flush();
  },
};
