import { router } from "../utils/trpc";
import { greetingRouter } from "./greeting";

// Add your routers here
export const appRouter = router({
  greeting: greetingRouter,
});

export type AppRouter = typeof appRouter;
