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
    <footer
      className={cn(
        'flex w-full min-w-0 flex-col items-center justify-center gap-y-1 text-sm font-medium md:w-auto md:flex-row md:gap-x-5',
        className,
      )}
    >
      <p className="max-w-full text-center break-words">{t('rights', { year: dayjs().year() })}</p>
      <p className="flex max-w-full min-w-0 flex-col items-center gap-1 text-center md:flex-row">
        {t.rich('developer', {
          kbislink: (chunks) => (
            <Link
              className="max-w-full text-center font-medium break-words underline underline-offset-2"
              href={process.env.NEXT_PUBLIC_KBIS_URL!}
              target="_blank"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
      <nav
        className="flex max-w-full min-w-0 flex-col items-center gap-y-1 md:flex-row md:gap-x-5"
        aria-label={t('legal-links')}
      >
        <Link
          className="order-2 font-medium underline underline-offset-2 md:order-1"
          href={`https://auth.kpi.ua/${locale}/terms-of-use`}
        >
          {t('terms-of-use')}
        </Link>
        <Link
          className="order-1 font-medium underline underline-offset-2 md:order-2"
          href={`https://auth.kpi.ua/${locale}/privacy-policy`}
        >
          {t('privacy-policy')}
        </Link>
      </nav>
    </footer>
  );
};
