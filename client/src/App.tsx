import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { useState } from "react";
import { trpc } from "./utils/trpc";
import superjson from "superjson";
import Index from "./Index";

export function App() {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        loggerLink({
          enabled: () => false,
        }),

        httpBatchLink({
          url: `${import.meta.env.VITE_BACKEND_URL}:${
            import.meta.env.VITE_BACKEND_PORT
          }`,
          fetch(url, opts) {
            // console.log(import.meta.env.VITE_BACKEND_PORT);
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
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Index />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
