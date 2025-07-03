import React, { createContext, useState, useEffect, useContext } from "react";
import { api, setAuthToken, clearAuthToken, getAuthToken } from "../api";

// PUBLIC_INTERFACE
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user session on load
  useEffect(() => {
    (async () => {
      const token = getAuthToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const prof = await api.getProfile();
        setProfile(prof);
        setUser({ email: prof.email, id: prof.id });
      } catch {
        setUser(null);
        setProfile(null);
        clearAuthToken();
      }
      setLoading(false);
    })();
  }, []);

  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    // Defensive: Ensure non-empty and string
    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      console.error("AuthContext.login: Invalid email or password argument", { email, password });
      throw { detail: "Login input invalid (frontend)." };
    }
    const data = await api.login({ email: String(email), password: String(password) });
    setAuthToken(data.token);
    const prof = await api.getProfile();
    setUser({ email: prof.email, id: prof.id });
    setProfile(prof);
    return data;
  };

  // PUBLIC_INTERFACE
  const register = async (email, password, name) => {
    const data = await api.register({ email, password, name });
    setAuthToken(data.token);
    const prof = await api.getProfile();
    setUser({ email: prof.email, id: prof.id });
    setProfile(prof);
    return data;
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    clearAuthToken();
    setUser(null);
    setProfile(null);
  };

  // PUBLIC_INTERFACE
  const updateProfile = async (update) => {
    const updated = await api.updateProfile(update);
    setProfile(updated);
    return updated;
  };

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      login, register, logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}
