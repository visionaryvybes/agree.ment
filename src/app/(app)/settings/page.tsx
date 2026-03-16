'use client';

import { UserProfile } from '@clerk/nextjs';

export default function SettingsPage() {
  return (
    <div className="p-12 lg:p-16 bg-[var(--bg)] min-h-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="heading-display text-4xl mb-10 uppercase font-black text-[var(--text-1)]">
          Account Settings
        </h1>
        <div className="brutalist-card bg-white border-4 p-8 shadow-[8px_8px_0_0_black]">
          <UserProfile routing="hash" />
        </div>
      </div>
    </div>
  );
}
