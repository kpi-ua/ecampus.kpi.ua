'use client';

import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Field } from '../login/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPassword } from '@/app/actions/auth.actions';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import CaretLeftRegular from '@/app/images/icons/CaretLeftRegular.svg';
import { TextButton } from '@/components/ui/text-button';
import { useRouter } from '@/i18n/routing';
import { Heading2 } from '@/components/typography/headers';

export default function PasswordReset({
  searchParams,
}: {
  searchParams: { username: string }
}) {
  const t = useTranslations('auth.passwordReset');
  const navT = useTranslations('global.navigation');
  const router = useRouter();
  const { errorToast } = useServerErrorToast();
  const username = searchParams.username;
  const { executeRecaptcha } = useGoogleReCaptcha();

  const FormSchema = z.object({
    username: z.string().min(1),
  });

  type FormData = z.infer<typeof FormSchema>;

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: username || '',
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      form.clearErrors();

      if (!executeRecaptcha) {
        return;
      }

      const token = await executeRecaptcha();

      await resetPassword(data.username, token);

      router.replace(`/password-reset/success?username=${data.username}`);
    } catch (error) {
      errorToast();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <TextButton
          variant="secondary"
          icon={<CaretLeftRegular />}
          className="my-6"
          href="/login"
        >
          {navT('back')}
        </TextButton>
        <Heading2>{t('header')}</Heading2>
        <p className="py-4 text-neutral-600">{t('description')}</p>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="grid items-center w-full gap-2 my-6">
              <Label htmlFor="username">{t('field.username')}</Label>
              <Input {...field} />
            </FormItem>
          )}
        />
        <Button
          size="big"
          className="w-[100%] my-4"
          type="submit"
          disabled={!form.formState.isValid || !executeRecaptcha}
          loading={form.formState.isSubmitting}
        >
          {t('button.reset')}
        </Button>
      </form>
    </Form>
  );
}
