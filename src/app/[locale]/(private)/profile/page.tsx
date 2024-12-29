import { getContacts, getContactTypes } from '@/actions/profile.actions';
import { Profile } from '@/app/[locale]/(private)/profile/Profile';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata() {
  const t = await getTranslations({ namespace: 'private.profile' });

  return {
    title: t('title'),
  };
}

export default async function Page() {
  const contacts = await getContacts();
  const contactTypes = await getContactTypes();

  return <Profile contacts={contacts} contactTypes={contactTypes} />;
}
