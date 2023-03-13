import { router } from "../utils/trpc";
import { authRouter } from "./session";
import { greetingRouter } from "./greeting";
import { credRouter } from "./auth";
import { packageRouter } from "./package";

// Add your routers here
export const appRouter = router({
  session: authRouter,
  auth: credRouter,
  greeting: greetingRouter,
  package: packageRouter,
});

export type AppRouter = typeof appRouter;
