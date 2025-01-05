'use client';

import { Heading5 } from '@/components/typography/headers';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import PasswordInput from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalStorage } from '@/hooks/use-storage';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/types/user';
import { useState } from 'react';
import { changeEmail, changePassword, changePhoto } from '@/actions/settings.actions';
import { useIsMobile } from '@/hooks/use-mobile';
import { PhotoUploader } from '@/app/[locale]/(private)/settings/photo-uploader';

export function SettingsForm() {
  const { errorToast } = useServerErrorToast();

  const isMobile = useIsMobile();

  const t = useTranslations('private.settings');

  const [user, setUser] = useLocalStorage<User>('user');

  const [file, setFile] = useState<File | null>(null);

  const FormSchema = z
    .object({
      email: z
        .string()
        .trim()
        .min(1)
        .email({ message: t('error.invalid-email') }),
      currentPassword: z.string().trim().optional(),
      newPassword: z.string().trim().optional(),
      confirmPassword: z.string().trim().optional(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('error.password-mismatch'),
      path: ['confirmPassword'],
    });

  type FormData = z.infer<typeof FormSchema>;

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      if (user?.email !== data.email) {
        const newUser = await changeEmail(data.email);
        if (newUser) {
          setUser(newUser);
        }
      }

      if (file) {
        const formData = new FormData();
        formData.append('file', file, file.name);
        await changePhoto(formData);
      }

      if (data.newPassword && data.currentPassword && data.confirmPassword) {
        await changePassword(data.newPassword, data.currentPassword, data.confirmPassword);
      }
    } catch (error) {
      errorToast();
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-8 space-y-1.5 p-10">
        <Heading5>{t('section.photo')}</Heading5>
        <PhotoUploader photoSrc={user?.photo || ''} onFileUpload={setFile} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col items-start space-y-4">
            <Heading5>{t('section.contacts')}</Heading5>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="my-6 grid w-full items-center gap-2">
                  <FormLabel htmlFor="email">E-mail</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="nickname@kpi.ua" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Heading5>{t('section.password')}</Heading5>
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="my-6 grid w-full items-center gap-2">
                  <FormLabel htmlFor="currentPassword">{t('field.current-password')}</FormLabel>
                  <PasswordInput {...field} value={field.value || ''} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="my-6 grid w-full items-center gap-2">
                  <FormLabel htmlFor="newPassword">{t('field.new-password')}</FormLabel>
                  <PasswordInput {...field} value={field.value || ''} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="my-6 grid w-full items-center gap-2">
                  <FormLabel htmlFor="confirmPassword">{t('field.confirm-password')}</FormLabel>
                  <PasswordInput {...field} value={field.value || ''} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormMessage className="text-red-500">{form.formState.errors.root?.message}</FormMessage>
            <Button
              size={isMobile ? 'medium' : 'big'}
              className="my-4 ml-auto"
              type="submit"
              loading={form.formState.isSubmitting}
            >
              {t('button.save-changes')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
