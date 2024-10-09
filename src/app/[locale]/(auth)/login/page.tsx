import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from './field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@/i18n/routing';
import { TextDivider } from '@/components/ui/text-divider';
import { useTranslations } from 'next-intl';

export default function Login() {
  const t = useTranslations('auth.login');

  return (
    <>
      <h2>{t('header')}</h2>
      <p className="py-4 text-neutral-600">{t('description')}</p>
      <Field>
        <Label htmlFor="email">{t('field.email')}</Label>
        <Input type="email" id="email" />
      </Field>
      <Field>
        <Label htmlFor="password">{t('field.password')}</Label>
        <Input type="password" id="password" />
      </Field>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember-me" />
          <Label className="text-neutral-800">{t('rememberMe')}</Label>
        </div>
        <Link className="text-sm" href="password-reset">{t('passwordReset')}</Link>
      </div>
      <Button size="lg" className="w-[100%] my-4">{t('button.login')}</Button>
      <TextDivider>{t('divider')}</TextDivider>
      <Button size="lg" variant="outline" className="w-[100%] my-4">
        {t('button.telegramLogin')}
      </Button>
    </>
  );
}
