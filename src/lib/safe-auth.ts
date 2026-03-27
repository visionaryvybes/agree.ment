/**
 * Server-side auth helper — returns a mock user ID.
 * Replace with real Clerk/auth when adding a real account.
 */
export async function auth() {
  return { userId: "user_guest_001" };
}
