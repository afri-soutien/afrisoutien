import { useState, useEffect } from "react";
import { authService, type User } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Try to fetch current user on app load to check if we have valid cookies
    if (!user && !isLoading) {
      setIsLoading(true);
      authService
        .getCurrentUser()
        .then((currentUser) => {
          setUser(currentUser);
          setIsAuthenticated(true);
        })
        .catch(() => {
          // No valid session
          setUser(null);
          setIsAuthenticated(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      return await authService.register(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    // Rediriger vers la page d'accueil après déconnexion
    window.location.href = '/';
  };

  const verifyEmail = async (token: string) => {
    return await authService.verifyEmail(token);
  };

  const forgotPassword = async (email: string) => {
    return await authService.forgotPassword(email);
  };

  const resetPassword = async (token: string, password: string) => {
    return await authService.resetPassword(token, password);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
  };
}
