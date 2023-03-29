import { authRouter } from "./session";
import { greetingRouter } from "./greeting";
import { credRouter } from "./auth";
import { packageRouter } from "./package";
import { employeeRouter } from "./employee";
import { router } from "../../utils/trpc";

// Add your routers here
export const appRouter = router({
  session: authRouter,
  auth: credRouter,
  greeting: greetingRouter,
  package: packageRouter,
  employee: employeeRouter,
});

export type AppRouter = typeof appRouter;
