'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
// FIXME:
// This version of recaptcha library should be replace with official one,
// when it starts to support React 19
import { useGoogleReCaptcha } from 'react19-google-recaptcha-v3';
import * as z from 'zod';

import { resetPassword } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useRouter } from '@/i18n/routing';

interface PasswordResetFormProps {
  username: string;
}

export default function PasswordResetForm({ username }: PasswordResetFormProps) {
  const t = useTranslations('auth.passwordReset');
  const router = useRouter();
  const { errorToast } = useServerErrorToast();
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
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="my-6 grid w-full items-center gap-2">
              <Label htmlFor="username">{t('field.username')}</Label>
              <Input {...field} />
            </FormItem>
          )}
        />
        <Button
          size="big"
          className="my-4 w-full"
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
