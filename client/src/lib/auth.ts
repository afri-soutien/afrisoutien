import { apiRequest } from "./queryClient";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isVerified: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  private user: User | null = null;

  constructor() {
    // No need to load from localStorage anymore - cookies handle authentication
  }

  async login(email: string, password: string): Promise<{ user: User }> {
    const response = await apiRequest("POST", "/api/auth/login", { email, password });
    const data: { user: User } = await response.json();
    
    this.user = data.user;
    return data;
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<{ message: string; user: User }> {
    const response = await apiRequest("POST", "/api/auth/register", userData);
    return await response.json();
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await apiRequest("GET", `/api/auth/verify-email?token=${token}`);
    return await response.json();
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiRequest("POST", "/api/auth/forgot-password", { email });
    return await response.json();
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await apiRequest("POST", "/api/auth/reset-password", { token, password });
    return await response.json();
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiRequest("GET", "/api/auth/me");
    
    if (!response.ok) {
      throw new Error("Failed to get current user");
    }

    const data = await response.json();
    this.user = data.user;
    return data.user;
  }

  async logout(): Promise<void> {
    try {
      await apiRequest("POST", "/api/auth/logout");
    } catch (error) {
      console.log("Logout request failed:", error);
    }
    this.user = null;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.user;
  }

  isAdmin(): boolean {
    return this.user?.role === "admin";
  }
}

export const authService = new AuthService();
