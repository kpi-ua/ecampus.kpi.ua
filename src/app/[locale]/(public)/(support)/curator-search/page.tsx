import { useTranslations } from 'next-intl';
import { SupportLayout } from '../support-layout';
import { CuratorSearch } from './curator-search';

export default function CuratorSearchPage() {
  const t = useTranslations('public.curator-search');

  return (
    <SupportLayout header={t('header')} description={t('description')} className="flex flex-col w-full grow">
      <CuratorSearch />
    </SupportLayout>
  );
}
