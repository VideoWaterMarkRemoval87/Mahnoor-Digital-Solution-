// Shared helper for the owner dashboard: attaches the session token issued by
// POST /api/owner/verify-access to every request, and clears the session if
// the server ever rejects it (expired or invalid token).

export function getOwnerToken(): string | null {
  const token = localStorage.getItem('mds_owner_token');
  const expires = Number(localStorage.getItem('mds_owner_token_expires') || 0);
  if (!token || !expires || Date.now() > expires) {
    return null;
  }
  return token;
}

export function isOwnerLoggedIn(): boolean {
  return getOwnerToken() !== null;
}

export function clearOwnerSession(): void {
  localStorage.removeItem('mds_owner_token');
  localStorage.removeItem('mds_owner_token_expires');
  // Remove the old, insecure flag from any previously-loaded version of the site.
  localStorage.removeItem('mds_owner_auth');
}

/**
 * fetch() wrapper that adds the owner's Authorization header automatically.
 * On a 401 response it clears the stored session and redirects to home,
 * since that means the token expired or was rejected by the server.
 */
export async function ownerFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = getOwnerToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(input, { ...init, headers });

  if (response.status === 401) {
    clearOwnerSession();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  return response;
}
