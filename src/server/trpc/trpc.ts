import { PrismaClient, UserRole } from "@prisma/client";
import { initTRPC, TRPCError } from "@trpc/server";
import { enhance } from "@zenstackhq/runtime";
import superjson from "superjson";
import { OpenApiMeta } from "trpc-to-openapi";

import { logger } from "@/shared/lib/logger";

import { Context } from "@/server/trpc/context";
import { requestContext } from "@/server/utils/requestContext";

export const t = initTRPC
  .context<Context>()
  .meta<OpenApiMeta>()
  .create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError: error.code === "BAD_REQUEST" ? error.cause : null,
        },
      };
    },
  });

const withZenStack = t.middleware(async ({ ctx, next }) => {
  const sessionUser = ctx.session?.user;
  const userId =
    sessionUser?.id !== undefined && sessionUser.id !== null ? Number(sessionUser.id) : undefined;

  const userRole =
    sessionUser?.role !== undefined && sessionUser?.role
      ? (sessionUser.role as UserRole)
      : undefined;

  const protectedDb = enhance(ctx.prisma, {
    user: userId !== undefined ? { id: userId, role: userRole } : undefined,
  }) as unknown as PrismaClient;

  return next({
    ctx: {
      ...ctx,
      db: protectedDb,
    },
  });
});

const contextMiddleware = t.middleware(async ({ ctx, next }) => {
  return requestContext.run(ctx.requestInfo, () => next({ ctx }));
});

const loggerMiddleware = t.middleware(async ({ path, type, next, ctx }) => {
  const start = performance.now();
  const userId = ctx.session?.user?.id ?? "guest";
  const role = ctx.session?.user?.role ?? "anon";

  // может быть шумно
  // logger.debug({ msg: 'Incoming tRPC', path, userId });

  const result = await next();

  const durationMs = Number((performance.now() - start).toFixed(2));

  const meta = {
    path,
    type,
    userId,
    role,
    durationMs,
    userAgent: ctx.requestInfo?.userAgent,
  };

  if (result.ok) {
    logger.info({ ...meta, msg: "tRPC OK" });
  } else {
    logger.error({
      ...meta,
      msg: "tRPC Error",
      code: result.error.code,
      message: result.error.message,
      // stack: result.error.stack, // стек
    });
  }

  return result;
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure
  .use(contextMiddleware)
  .use(loggerMiddleware)
  .use(withZenStack);

const isAuthed = t.middleware(({ ctx, next }) => {
  if (ctx.session == null || ctx.session.user == null) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Вы не авторизованы" });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = publicProcedure.use(isAuthed);

const isAdmin = t.middleware(({ ctx, next }) => {
  if (ctx.session?.user == null || ctx.session.user.role !== "ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Нужны права админа" });
  }

  return next({ ctx });
});

export const adminProcedure = protectedProcedure.use(isAdmin);
