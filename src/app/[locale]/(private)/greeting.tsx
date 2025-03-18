import { getUserDetails } from '@/actions/auth.actions';
import { Heading1 } from '@/components/typography/headers';
import { LOCALE } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { getLocale, getTranslations } from 'next-intl/server';

interface GreetingProps {
  className?: string;
}

export default async function Greeting({ className }: GreetingProps) {
  const user = await getUserDetails();
  const locale = await getLocale();
  const t = await getTranslations('private.main');

  const fullName = locale === LOCALE.EN ? user?.fullNameEnglish : user?.fullName;

  return (
    <Heading1 className={cn(className)}>
      {t('welcome')}, {fullName}!
    </Heading1>
  );
}
