import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { httpBatchLink, loggerLink } from "@trpc/client";
import SuperJSON from "superjson";
import Home from "./pages/Home";
import Error from "./pages/Error";
import Layout from "./pages/Layout";
import About from "./pages/About";
import { api } from "src/server/utils/api";
import { SessionContext, useSession } from "./auth/SessionProvider";
import { getServerAuthSession } from "src/server/auth/main";
import Index from "./Index";
function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: SuperJSON,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: "http://localhost:8080",
          fetch(url, opts) {
            return fetch(url, {
              ...opts,
              credentials: "include",
            });
          },
        }),
      ],
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Index />
      </QueryClientProvider>
    </api.Provider>
  );
}

export default App;
