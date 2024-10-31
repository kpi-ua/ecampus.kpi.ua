import { Button } from '@/components/ui/button';
import { CredentialsLogin } from './credentials-login';
import { PublicLinks } from './public-links';
import { TextDivider } from '@/components/ui/text-divider';
import { useTranslations } from 'next-intl';
import Telegram from '../../../images/icons/Telegram.svg';

export default function Login() {
  const t = useTranslations('auth.login');

  return (
    <>
      <h2>{t('header')}</h2>
      <p className="py-4 text-neutral-600">{t('description')}</p>
      <CredentialsLogin />
      <TextDivider>{t('divider')}</TextDivider>
      <Button size="big" variant="secondary" className="w-[100%] my-4">
        <Telegram />{t('button.telegramLogin')}
      </Button>
      <PublicLinks />
    </>
  );
}
