import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import http from "http";
import { Context, createContext } from "./context";
import { appRouter } from "./router/_app";

// This is how you initialize a context for the server

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

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
