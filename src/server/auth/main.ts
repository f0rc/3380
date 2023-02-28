import { IncomingMessage, ServerResponse } from "http";

export const getServerAuthSession = async (ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) => {
  ctx.req.headers.cookie?.split(";").forEach((cookie) => {
    console.log(cookie);
  });

  // return session bases on shit: {}
  // first check if there is a session cookie
  // if there is, check if it is valid
  // if it is valid, return the session
  // if it is not valid, return null
  // if there is not, return null
  //create a signin method that creates a session set it in cookies and returns it
  //create a signout method that deletes the session cookie
  //create a signup method that creates a user and a session and returns the session
  //create a getuser method that returns the user based on the session
};
