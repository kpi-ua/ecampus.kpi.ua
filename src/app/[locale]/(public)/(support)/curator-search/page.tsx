import { useTranslations } from 'next-intl';
import { SupportNavLayout } from '../support-nav-layout';
import { CuratorSearch } from './curator-search';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: any) {
  const t = await getTranslations({ locale, namespace: 'public.curator-search'});

  return {
    title: t('header'),
  };
}

export default function CuratorSearchPage() {
  const t = useTranslations('public.curator-search');

  return (
    <SupportNavLayout header={t('header')} description={t('description')} className="flex flex-col w-full grow">
      <CuratorSearch />
    </SupportNavLayout>
  );
}
