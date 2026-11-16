import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { getDaycare, getUser, normalizeEmail, useData } from '@/data';
import type { Daycare, ID, Role, User } from '@/types/models';

type AuthContextValue = {
  user: User | null;
  role: Role | null;
  daycare: Daycare | null;
  signIn: (email: string, password: string) => string | null;
  signInAs: (role: Role) => void;
  signOut: () => void;
  switchDaycare: (daycareId: ID) => void; 
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data } = useData();
  const [userId, setUserId] = useState<ID | null>(null);
  const [daycareId, setDaycareId] = useState<ID | null>(null);

  const value = useMemo<AuthContextValue>(() => {
    const user = userId ? (getUser(data, userId) ?? null) : null;

    const startSession = (u: User) => {
      setUserId(u.id);
      setDaycareId(u.daycareIds[0]);
    };

    return {
      user,
      role: user?.role ?? null,
      daycare: daycareId ? (getDaycare(data, daycareId) ?? null) : null,

      signIn: (email, password) => {
        const found = data.users.find((u) => normalizeEmail(u.email) === normalizeEmail(email));
        if (!found || found.password !== password) return 'Email or password is incorrect.';
        if (found.blocked) return 'This account is blocked. Contact the daycare.';
        startSession(found);
        return null;
      },

      signInAs: (role) => {
        const first = data.users.find((u) => u.role === role && !u.blocked);
        if (first) startSession(first);
      },

      signOut: () => {
        setUserId(null);
        setDaycareId(null);
      },

      switchDaycare: (id) => {
        if (user?.daycareIds.includes(id)) setDaycareId(id);
      },
    };
  }, [data, userId, daycareId]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an <AuthProvider>');
  return ctx;
}

export function useCurrentUser() {
  const { user, daycare } = useAuth();
  if (!user || !daycare) throw new Error('useCurrentUser used without an authenticated session');
  return { user, daycare };
}
