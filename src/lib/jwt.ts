import 'server-only';

import JWT, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';

import { TOKEN_COOKIE_NAME } from '@/lib/constants/cookies';
import { CampusJwtPayload } from '@/types/campus-jwt-payload';

export const getJWTPayload = <T extends JwtPayload>(token: string) => {
  return JWT.decode(token, { json: true }) as T;
};

export const userHasModule = async (module: string): Promise<boolean> => {
  const token = (await cookies()).get(TOKEN_COOKIE_NAME)?.value;
  const payload = token ? getJWTPayload<CampusJwtPayload>(token) : null;
  return payload?.modules?.includes(module) ?? false;
};
