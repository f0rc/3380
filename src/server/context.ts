import { inferAsyncReturnType } from "@trpc/server";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { postgresQuery } from "database/db";
import { Session } from "http";

// add your own context here
type CreateContextOptions = {
  session: Session | null;
};

export const createContextInner = async (opts: CreateContextOptions) => {
  console.table(opts);
  return {
    session: opts.session,
    postgres: postgresQuery,
  };
};

export function createContext(opts: CreateHTTPContextOptions) {
  const { req, res } = opts;

  // const session = await getSession({ req, res });
  return createContextInner({
    session: null,
  });
}
export type Context = inferAsyncReturnType<typeof createContext>;
