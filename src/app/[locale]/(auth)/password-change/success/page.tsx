import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function PasswordChangeSuccess() {
  const t = useTranslations('auth.passwordChange.success');

  return (
    <>
      <h2>{t('header')}</h2>
      <p className="py-4 text-neutral-600">{t('description')}</p>
      <Button size="big" className="w-[100%] my-4">{t('button')}</Button>
    </>
  );
}
