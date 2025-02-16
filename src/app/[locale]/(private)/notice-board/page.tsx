import { SubLayout } from '../sub-layout';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAnnouncements } from '@/actions/announcement.actions';
import { NoticeList } from '@/app/[locale]/(private)/notice-board/notice-list';
import { Heading1 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { Suspense } from 'react';

const INTL_NAMESPACE = 'private.notice-board';

export async function generateMetadata({ params: { locale } }: any) {
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function NoticeBoardPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations(INTL_NAMESPACE);

  const announcements = await getAnnouncements();
  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-6">
        <Heading1>{t('title')}</Heading1>
        <Paragraph className="text-neutral-700">{t('subtitle')}</Paragraph>
        <Suspense>
          <NoticeList announcements={announcements} />
        </Suspense>
      </div>
    </SubLayout>
  );
}
