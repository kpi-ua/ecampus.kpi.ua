import createMiddleware from 'next-intl/middleware';
import { routing } from '../i18n/routing';

export const intlMiddleware = createMiddleware(routing);
