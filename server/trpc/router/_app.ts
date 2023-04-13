import { authRouter } from "./session";
import { greetingRouter } from "./greeting";
import { credRouter } from "./auth";
import { packageRouter } from "./package";
import { employeeRouter } from "./employee";
import { router } from "../../utils/trpc";
import { productRouter } from "./product";
import { locationRouter } from "./location";
import { reportRouter } from "./reports";

// Add your routers here
export const appRouter = router({
  session: authRouter,
  auth: credRouter,
  greeting: greetingRouter,
  package: packageRouter,
  employee: employeeRouter,
  product: productRouter,
  location: locationRouter,
  report: reportRouter,
});

export type AppRouter = typeof appRouter;
