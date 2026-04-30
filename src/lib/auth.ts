import 'server-only';

import { cookies } from 'next/headers';
import { TOKEN_COOKIE_NAME } from './constants/cookies';
import { getJWTPayload } from './jwt';
import { CampusJwtPayload } from '@/types/campus-jwt-payload';

/**
 * Decodes the current user's JWT from the auth cookie. Returns `null`
 * when the cookie is missing (anonymous request).
 */
export async function getCurrentJwtPayload(): Promise<CampusJwtPayload | null> {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
  if (!jwt) return null;
  return getJWTPayload<CampusJwtPayload>(jwt);
}

/**
 * Modules granted to the current user (per the JWT `modules` claim).
 * Returns an empty array for anonymous requests so call sites can use
 * `.includes(...)` without null-guards.
 */
export async function getCurrentJwtModules(): Promise<string[]> {
  const payload = await getCurrentJwtPayload();
  return payload?.modules ?? [];
}

/** Whether the current user has the given module name in their JWT claims. */
export async function hasModule(name: string): Promise<boolean> {
  const modules = await getCurrentJwtModules();
  return modules.includes(name);
}
