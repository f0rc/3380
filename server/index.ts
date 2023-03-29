import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { createContext } from "./utils/context";
import http from "http";
import { appRouter } from "./trpc/router/_app";

// create handler
const handler = createHTTPHandler({
  router: appRouter,
  createContext,
});

const server = http.createServer((req, res) => {
  // CORS change this to your domain
  res.setHeader(
    "Access-Control-Allow-Origin",
    `https://testsssss-client.vercel.app`
  );
  res.setHeader("Access-Control-Request-Method", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("withCredentials", "true");
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  handler(req, res);
});

const port = process.env.PORT || 8080;
const host = "https://testsssss-production.up.railway.app";

server.on("listening", () => {
  console.log(`listening on https://${host}:${port} `);
});

server.listen(port);
