import { postgresQuery } from "src/database/db";
import { IncomingMessage, ServerResponse } from "http";
import { Session } from "src/utils/auth";

export const getServerAuthSession = async (ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) => {
  ctx.req.headers.cookie?.split(";").forEach((cookie) => {
    console.log("printing cookies " + cookie);
  });

  const sessionId = ctx.req.headers.cookie
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("auth-session-id="))
    ?.split("=")[1];

  if (sessionId) {
    const session = await getDatabaseSession(sessionId);
    if (session) {
      // console.log("sending session ");
      // console.table(session);
      return session;
    }
  }
  return null;
};

export const getDatabaseSession = async (sessionToken: string) => {
  const data = await postgresQuery(
    `SELECT * FROM "Sessions" WHERE "sessionToken" = $1 LIMIT 1`,
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
  console.log(dbSession);
  const expires = new Date(dbSession.expires);
  return {
    expires,
    user: {
      id: dbSession.userId,
      email: dbSession.email,
      role: dbSession.role,
    },
  };
};

//create a signin method that creates a session set it in cookies and returns it
//create a signout method that deletes the session cookie
//create a signup method that creates a user and a session and returns the session
