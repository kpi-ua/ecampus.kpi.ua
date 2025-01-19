import { useTranslations } from 'next-intl';
import { Heading1, Heading5 } from '@/components/typography/headers';
import { Logo, NotFound } from '@/app/images';
import { Link } from '@/i18n/routing';
import { Paragraph } from '@/components/typography/paragraph';
import dayjs from 'dayjs';

export default function NotFoundPage() {
  const t = useTranslations('global.not-found');

  return (
    <div className="flex min-h-screen flex-col">
      <div className="m-6 md:m-12">
        <Logo />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-10">
        <NotFound />
        <Heading1 className="max-w-[560px] text-center text-7xl font-medium text-neutral-900">{t('title')}</Heading1>
        <Heading5 className="max-w-[560px] text-center text-neutral-900">{t('description')}</Heading5>
        <Link className="underline" href="/">
          {t('return')}
        </Link>
      </div>

      <div className="m-6 mt-auto md:m-12">
        {t.rich('footer', {
          paragraph: (chunks) => <Paragraph className="m-0 text-sm font-normal">{chunks}</Paragraph>,
          kbislink: (chunks) => (
            <Link href={process.env.NEXT_PUBLIC_KBIS_URL!} target="_blank">
              {chunks}
            </Link>
          ),
          year: dayjs().year(),
        })}
      </div>
    </div>
  );
}
