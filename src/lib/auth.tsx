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

export function UserButton({ appearance }: { appearance?: any }) {
  const { user } = useContext(AuthContext);
  const initials = user?.firstName?.[0] ?? "G";
  return (
    <div
      className={
        appearance?.elements?.avatarBox ??
        "w-10 h-10 rounded-2xl border border-white/10"
      }
      style={{
        background: "linear-gradient(135deg,#00FFD1,#0070FF)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: 900,
        color: "#010101",
        cursor: "default",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
