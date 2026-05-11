import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  isPro: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  simulateStripeCheckout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate Firebase Auth initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem('trendeh_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const login = async () => {
    setIsLoading(true);
    // Simulate Google Cloud Identity Platform / Firebase Auth login
    setTimeout(() => {
      const mockUser: User = {
        uid: 'gcp-user-' + Math.random().toString(36).substr(2, 9),
        email: 'founder@example.com',
        displayName: 'Founder',
        isPro: false,
      };
      setUser(mockUser);
      localStorage.setItem('trendeh_user', JSON.stringify(mockUser));
      setIsLoading(false);
    }, 800);
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('trendeh_user');
  };

  const simulateStripeCheckout = async () => {
    if (!user) return;
    
    // Enforce a "payment" step before upgrading
    const confirmPayment = window.confirm(
      "Redirecting to Stripe Checkout...\n\n[Sandbox Mode] Would you like to authorize and simulate a successful payment to upgrade to the Pro plan?"
    );

    if (!confirmPayment) {
      alert("Payment cancelled. Your plan has not been upgraded.");
      return;
    }

    setIsLoading(true);
    // Simulate Stripe Checkout redirect and Google Cloud Function webhook fulfillment
    setTimeout(() => {
      const upgradedUser = { ...user, isPro: true };
      setUser(upgradedUser);
      localStorage.setItem('trendeh_user', JSON.stringify(upgradedUser));
      setIsLoading(false);
      alert('Payment successful! Your account has been upgraded to Pro via simulated Stripe webhook.');
    }, 1500);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, simulateStripeCheckout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
