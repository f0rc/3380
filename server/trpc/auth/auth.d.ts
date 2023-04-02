declare module "http" {
  interface IncomingMessage {
    session: Session;
  }
}

export interface Session {
  user?: {
    id: string;
    email: string;
    username?: string;
    employee_id?: string;
    customer_id?: string;
  } & DefaultSession["user"];
  expires: Date;
}

export interface DefaultSession {
  user?: {
    email?: string | null;
    role: number;
    // add more properties here
  };
}

export interface AuthUser {
  id: string;
  email: string;
  password: string;
}
