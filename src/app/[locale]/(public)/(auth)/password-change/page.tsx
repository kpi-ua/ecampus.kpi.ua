import { Button } from '@/components/ui/button';
import { Field } from '../login/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import { Heading2 } from '@/components/typography/headers';

export default function PasswordChange() {
  const t = useTranslations('auth.passwordChange');

  return (
    <>
      <Heading2>{t('header')}</Heading2>
      <p className="py-4 text-neutral-600">{t('description')}</p>
      <Field>
        <Label htmlFor="password">{t('field.password')}</Label>
        <Input type="password" id="password" />
      </Field>
      <Field>
        <Label htmlFor="password-repeat">{t('field.passwordRepeat')}</Label>
        <Input type="password-repeat" id="password-repeat" />
      </Field>
      <Button size="big" className="w-[100%] my-4">{t('button.set')}</Button>
    </>
  );
}
