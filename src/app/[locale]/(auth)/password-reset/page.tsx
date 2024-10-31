import { Button } from '@/components/ui/button';
import { Field } from '../login/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';

export default function PasswordReset() {
  const t = useTranslations('auth.passwordReset');

  return (
    <>
      <h2>{t('header')}</h2>
      <p className="py-4 text-neutral-600">{t('description')}</p>
      <Field>
        <Label htmlFor="email">{t('field.email')}</Label>
        <Input type="email" id="email" />
      </Field>
      <Button size="big" className="w-[100%] my-4">{t('button.reset')}</Button>
    </>
  );
}
