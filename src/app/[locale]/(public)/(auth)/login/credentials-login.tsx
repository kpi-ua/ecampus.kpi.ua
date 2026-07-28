'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { loginWithCredentials } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PasswordInput from '@/components/ui/password-input';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { Link } from '@/i18n/routing';

export const CredentialsLogin = () => {
  const t = useTranslations('auth.login');
  const router = useRouter();
  const { errorToast } = useServerErrorToast();

  const FormSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
  });

  type FormData = z.infer<typeof FormSchema>;

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    form.clearErrors();

    try {
      const response = await loginWithCredentials(data.username, data.password, true);

      if (!response) {
        form.setError('root', { message: t('field.error') });
        return;
      }
      router.replace('/');
    } catch (error) {
      errorToast();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="mb-[24px] grid w-full items-center gap-[8px]">
              <Label htmlFor="username">{t('field.username')}</Label>
              <Input id="username" {...field} />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid w-full items-center gap-[8px]">
              <Label htmlFor="password">{t('field.password')}</Label>
              <PasswordInput id="password" {...field} />
            </FormItem>
          )}
        />
        <Link className="mt-2 block text-right text-sm" href="/password-reset">
          {t('passwordReset')}
        </Link>
        <FormMessage>{form.formState.errors.root?.message}</FormMessage>
        <Button
          variant="secondary"
          size="big"
          className="mt-[36px] w-full"
          type="submit"
          loading={form.formState.isSubmitting}
        >
          {t('button.login')}
        </Button>
      </form>
    </Form>
  );
};
