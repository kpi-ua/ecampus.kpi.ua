'use client';

import { Heading5 } from '@/components/typography/headers';
import { useTranslations } from 'next-intl';
import { ProfilePicture } from '@/app/[locale]/(private)/profile-picture';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import PasswordInput from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalStorage } from '@/hooks/use-storage';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/types/user';
import { useRef, useState } from 'react';
import { changeEmail, changePassword, changePhoto } from '@/actions/settings.actions';
import { useIsMobile } from '@/hooks/use-mobile';

interface SettingsFormProps {
  className?: string;
}

export function SettingsForm({ className }: SettingsFormProps) {
  const { errorToast } = useServerErrorToast();

  const isMobile = useIsMobile();

  const t = useTranslations('private.settings');

  const inputRef = useRef<HTMLInputElement>(null);

  const [user] = useLocalStorage<User>('user');
  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(user?.photo);

  const FormSchema = z
    .object({
      email: z
        .string()
        .min(1)
        .email({ message: t('error.invalid-email') }),
      currentPassword: z.string().optional(),
      newPassword: z.string().optional(),
      confirmPassword: z.string().optional(),
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files?.[0];
    if (!files || !file) {
      return;
    }
    setFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleClick = () => {
    if (!inputRef || !inputRef.current) return;
    inputRef.current.click();
  };

  const handleFormSubmit = async (data: FormData) => {
    try {
      if (user?.email.trim() !== data.email.trim()) {
        await changeEmail(data.email.trim());
      }

      if (file) {
        const formData = new FormData();
        formData.append('file', file, file.name);
        await changePhoto(formData);
      }

      if (data.newPassword?.trim() && data.currentPassword?.trim() && data.confirmPassword?.trim()) {
        await changePassword(data.newPassword, data.currentPassword, data.confirmPassword);
      }
    } catch (error) {
      errorToast();
    }
  };

  return (
    <Card className={cn(className)}>
      <CardContent className="flex flex-col gap-8 space-y-1.5 p-10">
        <Heading5>{t('section.photo')}</Heading5>
        <div className="flex items-center gap-4">
          <ProfilePicture variant="xl" src={previewImage} />
          <Button className="h-fit" variant="secondary" onClick={handleClick}>
            {t('button.edit')}
          </Button>
          <input ref={inputRef} type="file" hidden onChange={handleFileUpload} />
        </div>
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
                  {form.formState.errors.confirmPassword && (
                    <span className="text-red-500">{form.formState.errors.confirmPassword?.message}</span>
                  )}
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
