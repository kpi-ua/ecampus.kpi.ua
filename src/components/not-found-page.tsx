import { useTranslations } from 'next-intl';
import { Heading0, Heading5 } from '@/components/typography/headers';
import { NotFound } from '@/app/images';
import { Link } from '@/i18n/routing';
import { Paragraph } from '@/components/typography/paragraph';
import dayjs from 'dayjs';
import { Logo } from './logo';

export default function NotFoundPage() {
  const t = useTranslations('global.not-found');

  return (
    <div className="flex min-h-screen flex-col justify-between p-6 md:p-12">
      <Logo />

      <div className="mx-auto flex max-w-[560px] flex-col items-center justify-center gap-10 text-center">
        <NotFound />
        <Heading0 className="font-medium text-neutral-900">{t('title')}</Heading0>
        <Heading5 className="text-neutral-900">{t('description')}</Heading5>
        <Link className="w-fit text-lg font-medium underline" href="/">
          {t('return')}
        </Link>
      </div>

      <div className="flex flex-col">
        {t.rich('footer', {
          paragraph: (chunks) => <Paragraph className="m-0 text-sm font-medium">{chunks}</Paragraph>,
          kbislink: (chunks) => (
            <Link href={process.env.NEXT_PUBLIC_KBIS_URL!} className="text-sm font-medium" target="_blank">
              {chunks}
            </Link>
          ),
          year: dayjs().year(),
        })}
      </div>
    </div>
  );
}
