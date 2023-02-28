import { IncomingMessage, IncomingMessage } from "http";

declare module "http" {
  interface Session {
    user?: {
      id: string;
      username: string;
    } & DefaultSession["user"];
  }
}

export interface DefaultSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires: Date;
}
