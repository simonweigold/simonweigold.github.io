/* Mock auth client for the admin dashboard.
 *
 * This is the seam for the real integration (see docs/admin-dashboard.md):
 * later it talks to the hosted backend (base URL from a public
 * VITE_API_BASE_URL env var) using either the hosted IdP's PKCE flow or
 * short-lived bearer tokens held in memory. No secrets may ever ship in
 * this bundle — everything here is public client-side code.
 */

export interface Session {
  email: string;
  token: string;
  issuedAt: number;
}

export class AuthError extends Error {}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function signIn(email: string, password: string): Promise<Session> {
  await delay(650 + Math.random() * 500); // simulate network latency
  if (password.length < 8) {
    throw new AuthError(
      "Access denied. This demo accepts any password with 8+ characters."
    );
  }
  return { email, token: "demo-token", issuedAt: Date.now() };
}
