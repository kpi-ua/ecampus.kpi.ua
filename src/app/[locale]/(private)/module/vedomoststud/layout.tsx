import { getTranslations } from 'next-intl/server';

import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Description, Heading2 } from '@/components/typography';

interface Props {
  children: React.ReactNode;
}

export default async function SessionLayout({ children }: Props) {
  const t = await getTranslations('private.vedomoststud');

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-9">
        <Heading2>{t('title')}</Heading2>
        <Description>{t('subtitle')}</Description>
        {children}
      </div>
    </SubLayout>
  );
}
