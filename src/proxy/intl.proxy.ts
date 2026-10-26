import createMiddleware from 'next-intl/middleware';
import { routing } from '../i18n/routing';

export const intlProxy = createMiddleware(routing);
