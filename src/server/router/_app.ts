import { router } from "../utils/trpc";
import { authRouter } from "./auth";
import { greetingRouter } from "./greeting";
import { credRouter } from "./signup";

// Add your routers here
export const appRouter = router({
  session: authRouter,
  signup: credRouter,
  greeting: greetingRouter,
});

export type AppRouter = typeof appRouter;
