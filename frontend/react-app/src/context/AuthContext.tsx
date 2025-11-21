import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  roles: string[];
  login: (token: string, roles: string[]) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  roles: [],
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [roles, setRoles] = useState<string[]>(() => {
    const stored = localStorage.getItem("roles");
    return stored ? JSON.parse(stored) : [];
  });

  function login(newToken: string, newRoles: string[]) {
    setToken(newToken);
    setRoles(newRoles);

    localStorage.setItem("token", newToken);
    localStorage.setItem("roles", JSON.stringify(newRoles));
  }

  function logout() {
    setToken(null);
    setRoles([]);

    localStorage.removeItem("token");
    localStorage.removeItem("roles");
  }

  return (
    <AuthContext.Provider value={{ token, roles, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
