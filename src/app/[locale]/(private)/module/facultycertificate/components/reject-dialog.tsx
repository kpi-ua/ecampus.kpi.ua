import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateCertificateBody } from '@/actions/certificates.actions';
import { useTranslations } from 'next-intl';
import { Certificate } from '@/types/models/certificate/certificate';

interface Props {
  certificate: Certificate;
  triggerButton: React.ReactNode;
  handleUpdateCertificate: (id: number, body: UpdateCertificateBody) => Promise<void>;
  shouldDisable?: boolean;
}

export const RejectDialog = ({ certificate, triggerButton, handleUpdateCertificate, shouldDisable }: Props) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations('private.facultycertificate');

  const FormSchema = z.object({
    reason: z.string().trim().min(1).max(255),
  });
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      reason: '',
    },
  });
  type FormData = z.infer<typeof FormSchema>;

  const handleFormSubmit = async (data: FormData) => {
    await handleUpdateCertificate(certificate.id, { approve: false, reason: data.reason });
    form.reset();
    setOpen(false);
  };

  return (
    <AlertDialog open={shouldDisable ? false : open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{triggerButton}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('alert.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('alert.subtitle', { name: certificate.requestedBy.fullName })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(handleFormSubmit)}>
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-2">
                  <FormLabel>{t('alert.reason')}*</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel className="w-full">{t('button.cancel')}</AlertDialogCancel>
              <Button
                className="bg-status-danger-300 w-full hover:hover:bg-red-600 active:border-red-700 active:bg-red-700"
                type="submit"
              >
                {t('button.reject')}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
