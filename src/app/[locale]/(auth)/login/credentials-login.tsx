'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from './field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@/i18n/routing';
import { loginWithCredentials } from '@/app/actions/auth.actions';
import { useTranslations } from 'next-intl';

export const CredentialsLogin = () => {
  const t = useTranslations('auth.login');

  const handleFormSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const username = formData.get('username');
    const password = formData.get('password');

    if (username && password) {
      const response = await loginWithCredentials(
        username.toString(),
        password.toString(),
      );

      console.log(response);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Field>
        <Label htmlFor="email">{t('field.email')}</Label>
        <Input name="username" id="email" />
      </Field>
      <Field>
        <Label htmlFor="password">{t('field.password')}</Label>
        <Input name="password" type="password" id="password" />
      </Field>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember-me" />
          <Label className="text-neutral-800">{t('rememberMe')}</Label>
        </div>
        <Link className="text-sm" href="password-reset">{t('passwordReset')}</Link>
      </div>
      <Button size="big" className="w-[100%] my-4" type="submit">{t('button.login')}</Button>
    </form>
  );
};
