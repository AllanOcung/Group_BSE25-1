import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  user: { email: string; name: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  const login = async (email: string, password: string) => {
    // Simulate API call - replace with actual authentication
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && password.length >= 6) {
          setIsLoggedIn(true);
          setUser({ email, name: email.split('@')[0] });
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};