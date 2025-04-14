import { getUserDetails } from '@/actions/auth.actions';
import { Heading1 } from '@/components/typography/headers';
import { cn } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';

interface GreetingProps {
  className?: string;
}

export default async function Greeting({ className }: GreetingProps) {
  const user = await getUserDetails();
  const t = await getTranslations('private.main');

  const fullName = user?.fullName;

  return <Heading1 className={cn(className)}>{t('welcome', { name: fullName })}</Heading1>;
}
