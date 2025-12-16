import { Heading2 } from '@/components/typography/headers';
import { Description } from '@/components/typography';
import { SubLayout } from '../../sub-layout';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LocaleProps } from '@/types/locale-props';
import { getColleagueContacts, getColleagueContactTypes } from '@/actions/colleague-contacts.actions';
import { ColleagueContactsList } from './components/colleague-contacts-list';

const INTL_NAMESPACE = 'private.directory';

export async function generateMetadata({ params }: LocaleProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default async function DirectoryPage({ params }: LocaleProps) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations(INTL_NAMESPACE);

  // Fetch both in parallel to reduce load time
  const [colleagues, contactTypes] = await Promise.all([getColleagueContacts(), getColleagueContactTypes()]);

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12">
        <Heading2>{t('title')}</Heading2>
        <Description>{t('subtitle')}</Description>
        <ColleagueContactsList colleagues={colleagues} contactTypes={contactTypes} />
      </div>
    </SubLayout>
  );
}
