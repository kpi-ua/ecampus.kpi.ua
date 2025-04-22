import { SubLayout } from '../sub-layout';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAnnouncements } from '@/actions/announcement.actions';
import { NoticeList } from '@/app/[locale]/(private)/notice-board/components/notice-list';
import { Heading1, Description } from '@/components/typography';
import { Suspense } from 'react';

interface Props {
  params: Promise<{ locale: string }>;
}

const INTL_NAMESPACE = 'private.notice-board';

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function NoticeBoardPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);
  const t = await getTranslations(INTL_NAMESPACE);

  const announcements = await getAnnouncements();
  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-6">
        <Heading1>{t('title')}</Heading1>
        <Description>{t('subtitle')}</Description>
        <Suspense>
          <NoticeList announcements={announcements} />
        </Suspense>
      </div>
    </SubLayout>
  );
}
