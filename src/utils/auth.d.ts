import { IncomingMessage, IncomingMessage } from "http";

declare module "http" {
  interface IncomingMessage {
    session: Session;
  }
}

export interface Session {
  user?: {
    id: string;
    username?: string;
  } & DefaultSession["user"];
  expires: Date;
}

export interface DefaultSession {
  user?: {
    email?: string | null;
    // add more properties here
  };
}
