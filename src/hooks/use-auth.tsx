import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authRepo, uid } from "@/lib/storage";
import type { User } from "@/lib/types";

interface Ctx {
  user: User | null;
  login: (email: string, _password: string, name?: string) => User;
  register: (name: string, email: string, company: string) => User;
  logout: () => void;
}

const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(authRepo.get().user);
  }, []);

  const login: Ctx["login"] = (email, _p, name) => {
    const u: User = {
      id: uid(),
      name: name ?? email.split("@")[0],
      email,
      company: "Acme Inc",
      role: "Admin",
    };
    authRepo.set(u);
    setUser(u);
    return u;
  };

  const register: Ctx["register"] = (name, email, company) => {
    const u: User = { id: uid(), name, email, company, role: "Admin" };
    authRepo.set(u);
    setUser(u);
    return u;
  };

  const logout = () => {
    authRepo.set(null);
    setUser(null);
  };

  return <AuthCtx.Provider value={{ user, login, register, logout }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth outside provider");
  return c;
};
