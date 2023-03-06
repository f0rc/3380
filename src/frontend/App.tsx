import { useState } from "react";
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
  const user = "lol";
  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <SessionContext.Provider value={user}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="*" element={<Error />} />
            </Route>
          </Routes>
        </SessionContext.Provider>
      </QueryClientProvider>
    </api.Provider>
  );
}

export default App;
