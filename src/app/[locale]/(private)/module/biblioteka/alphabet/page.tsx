import { getTranslations } from 'next-intl/server';

import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { userHasModule } from '@/lib/jwt';
import { LocaleProps } from '@/types/locale-props';

import { AlphabetBrowser } from './components/alphabet-browser';
import { LibraryTabs } from '../components/library-tabs';
import { LIBRARY_EDIT_MODULE, LIBRARY_TAB } from '../constants';

const INTL_NAMESPACE = 'private.library';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });
  return { title: t('alphabet.title') };
}

export default async function AlphabetPage() {
  const t = await getTranslations(INTL_NAMESPACE);
  const canEdit = await userHasModule(LIBRARY_EDIT_MODULE);
  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-full flex w-full min-w-0 flex-col gap-6 pb-8">
        <LibraryTabs active={LIBRARY_TAB.ALPHABET} />
        <AlphabetBrowser canEdit={canEdit} />
      </div>
    </SubLayout>
  );
}
