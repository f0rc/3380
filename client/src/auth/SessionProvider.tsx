import { createContext, ReactNode, useEffect, useState } from "react";
import { Session } from "../../../server/trpc/auth/auth";
import { trpc } from "../utils/trpc";

export const AuthContext = createContext<{
  authenticated: Session | null;
  setAuthenticated: (session: Session | null) => void;
}>({
  authenticated: null,
  setAuthenticated: () => {},
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [authenticated, setAuthenticated] = useState<Session | null>(null);

  const { data: session, isError } = trpc.session.getSession.useQuery();

  useEffect(() => {
    // console.log("calling sesstion use effect");
    setAuthenticated(session || null);
  }, [session]);

  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

type AuthProviderProps = {
  children: ReactNode;
};
