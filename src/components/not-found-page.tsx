import dayjs from 'dayjs';
import { getTranslations } from 'next-intl/server';

import { NotFound } from '@/app/images';
import { Heading0, Heading5 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { Link } from '@/i18n/routing';

import { Logo } from './logo';
import RichText from './typography/rich-text';

export default async function NotFoundPage() {
  const t = await getTranslations('global.not-found');

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
        <RichText>
          {(tags) =>
            t.rich('footer', {
              ...tags,
              paragraph: (chunks) => <Paragraph className="m-0 text-sm font-medium">{chunks}</Paragraph>,
              kbislink: (chunks) => (
                <Link href={process.env.NEXT_PUBLIC_KBIS_URL!} className="text-sm font-medium" target="_blank">
                  {chunks}
                </Link>
              ),
              year: dayjs().year(),
            })
          }
        </RichText>
      </div>
    </div>
  );
}
