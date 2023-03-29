import { IncomingMessage, ServerResponse } from "http";
import { postgresQuery } from "../../database/db";
import { Session } from "./auth";

export const getServerAuthSession = async (ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) => {
  const sessionId = ctx.req.headers.cookie
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("auth-session-id="))
    ?.split("=")[1];

  if (sessionId) {
    const session = await getDatabaseSession(sessionId);
    if (session) {
      return session;
    }
  }
  return null;
};

export const getDatabaseSession = async (sessionToken: string) => {
  const data = await postgresQuery(
    `SELECT "SESSION"."token","SESSION"."expires", "USER"."user_id", "USER"."email", "USER"."role" FROM "SESSION", "USER" WHERE "token" = $1 AND "USER"."user_id" = "SESSION"."user_id" LIMIT 1`,
    [sessionToken]
  );
  if (data.rowCount === 0) {
    return;
  }

  // get the user now and return the session
  const session = mapDBSessionToSession(data.rows[0]);

  if (session.expires < new Date()) {
    return;
  }

  return session;
};

export const mapDBSessionToSession = (dbSession: any): Session => {
  const expires = new Date(dbSession.expires);

  return {
    expires,
    user: {
      id: dbSession.user_id,
      email: dbSession.email,
      role: dbSession.role,
    },
  };
};

//create a signin method that creates a session set it in cookies and returns it
//create a signout method that deletes the session cookie
//create a signup method that creates a user and a session and returns the session
