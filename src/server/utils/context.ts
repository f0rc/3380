import { inferAsyncReturnType } from "@trpc/server";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { postgresQuery } from "src/database/db";
import { Session } from "src/utils/auth";
import { getServerAuthSession } from "../auth/main";

type CreateContextOptions = {
  session: Session | null;
};

const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    postgresQuery,
  };
};

export async function createContext(opts: CreateHTTPContextOptions) {
  const { req, res } = opts;

  const session = await getServerAuthSession({ req, res });
  return createContextInner({
    session: session,
  });
}
export type Context = inferAsyncReturnType<typeof createContext>;
