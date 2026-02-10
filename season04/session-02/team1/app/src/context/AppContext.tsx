import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, Position } from '../types';
import initialUserData from '../data/user.json';
import initialPositionsData from '../data/positions.json';

interface AppContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  positions: Position[];
  setPositions: React.Dispatch<React.SetStateAction<Position[]>>;
  addPosition: (position: Position) => void;
  updateBalance: (amount: number) => void;
  rechargeBalance: () => void;
  isOnboarded: boolean;
  setOnboarded: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(initialUserData as User);
  const [positions, setPositions] = useState<Position[]>(initialPositionsData as Position[]);
  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem('mh_onboarded') === 'true';
  });

  const setOnboarded = (value: boolean) => {
    localStorage.setItem('mh_onboarded', String(value));
    setIsOnboarded(value);
  };

  const addPosition = (position: Position) => {
    setPositions((prev) => [...prev, position]);
    setUser((prev) => ({
      ...prev,
      virtualBalance: prev.virtualBalance - position.amount,
    }));
  };

  const updateBalance = (amount: number) => {
    setUser((prev) => ({
      ...prev,
      virtualBalance: prev.virtualBalance + amount,
    }));
  };

  const rechargeBalance = () => {
    setUser((prev) => ({
      ...prev,
      virtualBalance: prev.virtualBalance + 1000000,
      totalDeposited: prev.totalDeposited + 1000000,
    }));
  };

  // Calculate total loss based on positions
  useEffect(() => {
    const totalProfitLoss = positions.reduce((sum, pos) => {
      if (pos.category === 'overseas' && pos.currency === 'USD') {
        // Convert USD to KRW (approximate rate)
        return sum + (pos.profitLoss * 1350);
      }
      return sum + pos.profitLoss;
    }, 0);

    const actualLoss = totalProfitLoss < 0 ? Math.abs(totalProfitLoss) : 0;

    setUser((prev) => ({
      ...prev,
      totalLoss: prev.totalDeposited - prev.virtualBalance + actualLoss,
      rankScore: prev.totalDeposited - prev.virtualBalance + actualLoss,
    }));
  }, [positions]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        positions,
        setPositions,
        addPosition,
        updateBalance,
        rechargeBalance,
        isOnboarded,
        setOnboarded,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
