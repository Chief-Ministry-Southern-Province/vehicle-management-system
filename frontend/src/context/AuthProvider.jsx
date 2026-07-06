import { useState } from "react";
import { AuthContext } from "./AuthContext";

function getStoredAuthValue(key) {
  const value = localStorage.getItem(key);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredAuthValue("user"));
  const [token, setToken] = useState(() => getStoredAuthValue("token"));

  const login = (userData, authToken = userData?.token) => {
    const nextUser = authToken
      ? { ...userData, token: undefined }
      : userData;

    localStorage.setItem("user", JSON.stringify(nextUser));

    if (authToken) {
      localStorage.setItem("token", authToken);
    }

    setUser(nextUser);
    setToken(authToken || null);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}