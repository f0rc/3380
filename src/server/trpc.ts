import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import {
  CreateHTTPContextOptions,
  createHTTPServer,
} from "@trpc/server/adapters/standalone";
import superjson from "superjson";
import { z } from "zod";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import http from "http";

// // This is how you initialize a context for the server
export function createContext(opts: CreateHTTPContextOptions) {
  return {};
}
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const publicProcedure = t.procedure;
export const router = t.router;

const greetingRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input?.name ?? "world"}`,
      };
    }),
});

const appRouter = router({
  greeting: greetingRouter,
});

export type AppRouter = typeof appRouter;
// create handler
const handler = createHTTPHandler({
  router: appRouter,
  createContext,
});

const server = http.createServer((req, res) => {
  // CORS change this to your domain
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Request-Method", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  handler(req, res);
});

server.on("listening", () => {
  console.log("listening on http://localhost:8080");
});

server.listen(8080);
