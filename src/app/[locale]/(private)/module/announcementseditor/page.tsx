import { getTranslations } from 'next-intl/server';

import {
  getAdminAnnouncements,
} from '@/actions/announcement.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Description, Heading2 } from '@/components/typography';
import { PAGE_SIZE_DEFAULT } from '@/lib/constants/page-size';
import { LocaleProps } from '@/types/locale-props';

import { AnnouncementsListPage } from './announcements-list-page';
import { LOCALE } from '@/i18n/routing';

const INTL_NAMESPACE = 'private.announcementseditor';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return {
    title: t('title'),
  };
}

interface PageProps extends LocaleProps {
  searchParams: Promise<{ page: number; search: string; language: LOCALE; }>;
}

export default async function AnnouncementsPage({ searchParams }: PageProps) {
  const t = await getTranslations(INTL_NAMESPACE);

  const params = await searchParams;

  const adminData = await getAdminAnnouncements({
    page: params.page,
    pageSize: PAGE_SIZE_DEFAULT,
    search: params.search,
    language: params.language,
  });

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12">
        <Heading2>{t('title')}</Heading2>
        <Description>{t('subtitle')}</Description>

        <AnnouncementsListPage
          items={adminData.items}
          total={adminData.total}
          page={params.page}
          pageSize={PAGE_SIZE_DEFAULT}
        />
      </div>
    </SubLayout>
  );
}
