'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

import { K7_DASHBOARD_VIEW, K7DashboardView } from '../constants';

interface Props {
  activeView: K7DashboardView;
  hasDepartmentProfiles: boolean;
  hasUniversityCathedras: boolean;
}

const navigationItems: { view: K7DashboardView; href: string }[] = [
  { view: K7_DASHBOARD_VIEW.Personal, href: '/module/k7-form' },
  { view: K7_DASHBOARD_VIEW.Department, href: '/module/k7-form/department' },
  { view: K7_DASHBOARD_VIEW.University, href: '/module/k7-form/university' },
];

export const K7DashboardNavigation = ({ activeView, hasDepartmentProfiles, hasUniversityCathedras }: Props) => {
  const t = useTranslations('private.k-7.tabs');
  const visibleItems = navigationItems.filter(
    ({ view }) =>
      (view !== K7_DASHBOARD_VIEW.Department || hasDepartmentProfiles) &&
      (view !== K7_DASHBOARD_VIEW.University || hasUniversityCathedras),
  );

  return (
    <nav
      className="border-neutral-divider flex h-12 w-full justify-start overflow-x-auto border-b bg-white"
      aria-label={t('navigation')}
    >
      {visibleItems.map(({ view, href }) => {
        const active = view === activeView;

        return (
          <Link
            key={view}
            href={href}
            className={cn(
              'inline-flex h-12 shrink-0 items-center border-b-2 border-transparent px-5 text-sm font-semibold whitespace-nowrap text-neutral-400 transition-colors',
              'focus-visible:outline-basic-blue focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
              active && 'border-basic-blue text-basic-blue',
            )}
          >
            {t(view)}
          </Link>
        );
      })}
    </nav>
  );
};
