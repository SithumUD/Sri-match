"use client";

import React, { useEffect, createContext, useContext } from "react";
import useAuthStore from "../store/useAuthStore";

const defaultAuthContext: any = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isAuthLoading: false,
  adminUser: null,
  isAdminAuthenticated: false,
  fetchUserSession: async () => {},
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  adminLogin: async () => ({ success: false }),
  adminLogout: async () => {},
  updateUserProfile: async () => ({ success: false }),
};

const AuthContext = createContext<any>(defaultAuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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
  return context || defaultAuthContext;
};

export default AuthContext;