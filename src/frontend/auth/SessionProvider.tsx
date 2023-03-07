import React, { useContext } from "react";
import { Session } from "src/utils/auth";

export const SessionContext = React.createContext<Session | null | undefined>(
  undefined
);

export const useSession = () => {
  const session = useContext(SessionContext);
  console.log("USE SESSION HOOK INVOKED", session);
  if (session === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return session;
};

// if (!session) {
//   throw new Error("useSession must be used within a SessionProvider");
// }
