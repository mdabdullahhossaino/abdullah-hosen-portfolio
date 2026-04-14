import { createContext, useContext, useEffect, useState } from "react";

const TOKEN_KEY = "admin_token";

interface AdminContextValue {
  adminToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextValue>({
  adminToken: null,
  login: () => {},
  logout: () => {},
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminToken, setAdminToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );

  // Keep localStorage in sync
  useEffect(() => {
    if (adminToken) {
      localStorage.setItem(TOKEN_KEY, adminToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [adminToken]);

  function login(token: string) {
    setAdminToken(token);
  }

  function logout() {
    setAdminToken(null);
  }

  return (
    <AdminContext.Provider value={{ adminToken, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}

export { AdminContext };
