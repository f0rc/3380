import { inferAsyncReturnType } from "@trpc/server";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { Session } from "../trpc/auth/auth";
import { postgresQuery } from "../database/db";
import { getServerAuthSession } from "../trpc/auth/main";

type CreateContextOptions = {
  session: Session | null;
  req: CreateHTTPContextOptions["req"];
  res: CreateHTTPContextOptions["res"];
};

const createContextInner = async (opts: CreateContextOptions) => {
  const { req, res } = opts;
  return {
    session: opts.session,
    postgresQuery, // this is the response object
    req,
    res,
  };
};

export async function createContext(opts: CreateHTTPContextOptions) {
  const { req, res } = opts;

  // console.log("COOKIE", req.headers.cookie);

  const session = await getServerAuthSession({ req, res });
  return createContextInner({
    session: session,
    req,
    res,
  });
}
export type Context = inferAsyncReturnType<typeof createContext>;
