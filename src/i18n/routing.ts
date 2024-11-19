import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export enum LOCALE {
  UK = 'uk',
  EN = 'en',
}

export const LOCALES = [LOCALE.UK, LOCALE.EN];

export const DEFAULT_LOCALE = LOCALE.UK;

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation(routing);