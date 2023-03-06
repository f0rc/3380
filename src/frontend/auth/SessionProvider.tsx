import React, { useState, useEffect, useContext } from "react";

export const SessionContext = React.createContext("");

export const useSession = () => {
  const session = useContext(SessionContext);
  if (!session) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return session;
};
