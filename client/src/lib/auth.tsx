import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  isNewUser?: number; // 1 = new user, 0 = onboarded
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserOnboardingStatus?: (isCompleted: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await apiRequest("GET", "/api/auth/user");
      const userData = await response.json();
      
      setUser(userData);
    } catch (error) {
      localStorage.removeItem("auth_token");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiRequest("POST", "/api/auth/login", { email, password });
      const data = await response.json();

      localStorage.setItem("auth_token", data.token);
      setUser(data.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await apiRequest("POST", "/api/auth/register", { name, email, password });
      const data = await response.json();

      localStorage.setItem("auth_token", data.token);
      setUser(data.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  const updateUserOnboardingStatus = async (isCompleted: boolean) => {
    try {
      const response = await apiRequest("POST", "/api/auth/complete-onboarding", { 
        isCompleted 
      });
      
      if (response.ok) {
        // Update user state
        setUser(prev => prev ? { ...prev, isNewUser: isCompleted ? 0 : 1 } : null);
      }
    } catch (error) {
      console.error("Failed to update onboarding status:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUserOnboardingStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}