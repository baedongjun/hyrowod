import { AuthResponse, User } from "@/types";

export const saveAuth = (auth: AuthResponse) => {
  localStorage.setItem("accessToken", auth.accessToken);
  localStorage.setItem("refreshToken", auth.refreshToken);
  localStorage.setItem("user", JSON.stringify({
    email: auth.email,
    name: auth.name,
    role: auth.role,
  }));
};

export const clearAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("accessToken");
};

export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === "ROLE_ADMIN";
};

export const isBoxOwner = (): boolean => {
  const user = getUser();
  return user?.role === "ROLE_BOX_OWNER" || user?.role === "ROLE_ADMIN";
};
