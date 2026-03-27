"use client";

import React, { createContext, useContext } from 'react';

// Simplified mock Clerk context to prevent hooks from throwing
const MockContext = createContext<any>({
  isLoaded: true,
  isSignedIn: true,
  user: {
    id: 'user_mock',
    firstName: 'Guest',
    lastName: 'User',
    username: 'guest',
    imageUrl: '',
    primaryEmailAddress: { emailAddress: 'guest@example.com' },
  },
});

export const MockClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MockContext.Provider value={{ isLoaded: true, isSignedIn: true }}>
      {children}
    </MockContext.Provider>
  );
};

// We don't actually need to export useUser from here because we want the real
// @clerk/nextjs to not throw. However, we can't easily mock the package's exports.
// Instead, we will wrap the content in ClerkProvider but with a safe publishable key
// if the user has one, OR we will just make the pages resilient.
// But the BEST way is to keep ClerkProvider even with mock keys, but fix the script error.
// The script error comes from Clerk trying to load its JS from a URL that might be blocked or invalid.
