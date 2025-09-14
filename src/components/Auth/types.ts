// src/components/Auth/types.ts

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'moderator';
  avatar?: string;
  isEmailVerified: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface AuthError {
  message: string;
  field?: string;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: User['role'];
  fallback?: React.ReactNode;
}