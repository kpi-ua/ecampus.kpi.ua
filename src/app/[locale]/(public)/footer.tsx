import dayjs from 'dayjs';
import { getLocale, getTranslations } from 'next-intl/server';
import Link from 'next/link';

import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export const Footer = async ({ className }: FooterProps) => {
  const locale = await getLocale();
  const t = await getTranslations('auth.footer');

  return (
    <footer className={cn('flex flex-col items-center gap-1 text-sm', className)}>
      <p>{t('rights', { year: dayjs().year() })}</p>
      <p>
        {t.rich('developer', {
          kbislink: (chunks) => (
            <Link href={process.env.NEXT_PUBLIC_KBIS_URL!} target="_blank">
              {chunks}
            </Link>
          ),
        })}
      </p>
      <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1" aria-label={t('legal-links')}>
        <Link href={`https://auth.kpi.ua/${locale}/privacy-policy`}>{t('privacy-policy')}</Link>
        <Link href={`https://auth.kpi.ua/${locale}/terms-of-use`}>{t('terms-of-use')}</Link>
      </nav>
    </footer>
  );
};
