import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "../router/_app";

export const api = createTRPCReact<AppRouter>({});
