'use client';

import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPassword } from '@/actions/auth.actions';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
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
          className="my-4 w-[100%]"
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
