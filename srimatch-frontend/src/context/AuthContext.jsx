import React, { useEffect, createContext, useContext } from "react";
import useAuthStore from "../store/useAuthStore";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const store = useAuthStore();

  useEffect(() => {
    store.fetchUserSession();
  }, []);

  return (
    <AuthContext.Provider value={store}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};