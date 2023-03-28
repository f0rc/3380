import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "src/server/utils/api";
import { Session } from "src/utils/auth";

export const AuthContext = createContext<{
  authenticated: Session | null;
  setAuthenticated: (session: Session | null) => void;
}>({
  authenticated: null,
  setAuthenticated: () => {},
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [authenticated, setAuthenticated] = useState<Session | null>(null);

  const { data: session, isError } = api.session.getSession.useQuery();

  useEffect(() => {
    console.log("calling sesstion use effect");
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
