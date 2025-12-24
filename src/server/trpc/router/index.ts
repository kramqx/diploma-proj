import { createTRPCRouter } from "@/server/trpc/trpc";

export const appRouter = createTRPCRouter({}); // добавить authRouter, etc.

export type AppRouter = typeof appRouter;
