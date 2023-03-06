import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { createContext } from "./utils/context";
import http from "http";
import { appRouter } from "./router/_app";

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
