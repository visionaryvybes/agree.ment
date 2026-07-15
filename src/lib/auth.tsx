"use client";

/**
 * Local auth system — zero external dependencies, zero CDN requests.
 * Drop-in replacement for @clerk/nextjs in mock/dev mode.
 * Swap this file for real Clerk when you add a Clerk account.
 */

import React, { createContext, useContext, ReactNode } from "react";

// ─── Mock User ──────────────────────────────────────────────────────────────

const MOCK_USER = {
  id: "user_guest_001",
  firstName: "Guest",
  lastName: "User",
  fullName: "Guest User",
  username: "guest",
  imageUrl: "",
  primaryEmailAddress: { emailAddress: "guest@agreemint.dev" },
};

// ─── Context ─────────────────────────────────────────────────────────────────

interface AuthContextValue {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: typeof MOCK_USER | null;
}

const AuthContext = createContext<AuthContextValue>({
  isLoaded: true,
  isSignedIn: true,
  user: MOCK_USER,
});

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ isLoaded: true, isSignedIn: true, user: MOCK_USER }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useUser() {
  return useContext(AuthContext);
}

// ─── UserButton ───────────────────────────────────────────────────────────────

export function UserButton(_props: { appearance?: any }) {
  const { user } = useContext(AuthContext);
  const initials = user?.firstName?.[0] ?? "G";
  return (
    <div
      title={user?.fullName ?? "Guest"}
      className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-card border-[1.5px] border-line-strong rounded-[3px] shadow-[2px_2px_0_var(--shadow-ink)] rotate-[-2deg] cursor-default select-none"
    >
      <span className="font-mono font-bold text-[13px] text-mint leading-none">
        {initials}
        <span className="text-ink-3">/</span>
      </span>
    </div>
  );
}
