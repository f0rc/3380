import { router } from "../utils/trpc";
import { authRouter } from "./auth";
import { greetingRouter } from "./greeting";

// Add your routers here
export const appRouter = router({
  session: authRouter,
  greeting: greetingRouter,
});

export type AppRouter = typeof appRouter;
