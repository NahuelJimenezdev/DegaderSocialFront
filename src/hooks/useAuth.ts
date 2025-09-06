import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { User } from "../types";

// Mock user for development without backend
const mockUser: User = {
  id: "mock-user-id",
  email: "dev@solyluna.com",
  first_name: "Desarrollador",
  last_name: "Sol & Luna",
  full_name: "Desarrollador Sol & Luna",
  avatar_url:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  role: "admin",
  status: "activo",
  position: "Desarrollador Full Stack",
  country: "Argentina",
  city: "Buenos Aires",
  address: "Calle Ejemplo 123",
  bio: "Desarrollador apasionado por crear experiencias digitales increíbles",
  hierarchy_level: "nacional",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay and set mock user
    const timer = setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  async function fetchUserProfile(userId: string) {
    // Mock implementation - return mock user
    setUser(mockUser);
    setLoading(false);
  }

  async function signIn(email: string, password: string) {
    // Mock implementation - always succeed
    return {
      data: { user: mockUser },
      error: null,
    };
  }

  async function signUp(
    email: string,
    password: string,
    userData: Partial<User>
  ) {
    // Mock implementation - always succeed
    const newUser = {
      ...mockUser,
      email,
      ...userData,
    };
    return {
      data: { user: newUser },
      error: null,
    };
  }

  async function signOut() {
    // Mock implementation - clear user
    setUser(null);
    return { error: null };
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
