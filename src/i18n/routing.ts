import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const LOCALES = ['uk', 'en'];

export const DEFAULT_LOCALE = 'uk';

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation(routing);