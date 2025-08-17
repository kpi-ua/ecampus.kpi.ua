'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyCertificate } from '@/actions/certificates.actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CertificateVerificationResult } from '@/types/models/certificate/certificate-verification-result';
import { LoadingState } from '@/app/[locale]/(public)/validate-certificate/components/loading-state';
import { EmptyState } from '@/app/[locale]/(public)/validate-certificate/components/empty-state';
import { CertificateDetails } from '@/app/[locale]/(public)/validate-certificate/components/certificate-details';
import { Warning } from '@/app/images';
import { Paragraph } from '@/components/typography';
import Link from 'next/link';
import { TELEGRAM_SUPPORT_LINK } from '@/lib/constants/telegram-suuport-link';

export function CertificateVerifier() {
  const autoSubmittedRef = useRef(false);

  const [result, setResult] = useState<CertificateVerificationResult | string | null>(null);

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const FormSchema = z.object({
    certificateId: z.string().trim().min(1),
  });

  type FormData = z.infer<typeof FormSchema>;

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      certificateId: token || '',
    },
  });

  const handleFormSubmit = useCallback(
    async (data: FormData) => {
      setResult('');
      const res = await verifyCertificate(data.certificateId);
      form.reset();
      setResult(res);
    },
    [form],
  );

  useEffect(() => {
    if (!token || autoSubmittedRef.current) {
      return;
    }

    setResult('');
    form.setValue('certificateId', token, { shouldValidate: true, shouldDirty: false });
    autoSubmittedRef.current = true;
    form.handleSubmit(handleFormSubmit)();
  }, [searchParams, form, handleFormSubmit, token]);

  const tResultCard = useTranslations('public.verification.result');
  const tSearchCard = useTranslations('public.verification.search');

  const isApproved = typeof result === 'object' && result?.status === 'Approved';
  const isEmpty = result === null;
  const isError = result === 'error';

  return (
    <>
      <Card className="flex h-full w-full max-w-[600px] flex-col justify-center self-center">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl">{tSearchCard('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(handleFormSubmit)}>
              <FormField
                control={form.control}
                name="certificateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tSearchCard('label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={tSearchCard('placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                size="big"
                disabled={!form.formState.isValid}
                loading={form.formState.isSubmitting}
              >
                {tSearchCard('check')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="h-full w-full max-w-[600px] self-center">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl">{tResultCard('title')}</CardTitle>
        </CardHeader>
        <CardContent className="flex min-h-[220px] w-full items-center justify-center p-6">
          {form.formState.isSubmitting && <LoadingState t={tResultCard} />}

          {isEmpty && <EmptyState t={tResultCard} />}

          {isApproved && <CertificateDetails result={result} t={tResultCard} />}

          {isError && (
            <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 text-center">
              <div className="text-neutral-500">
                <Warning />
              </div>
              <Paragraph className="m-0 text-lg font-semibold text-neutral-900">{tResultCard('notfound')}</Paragraph>
              <Paragraph className="m-0 font-medium text-neutral-500">{tResultCard('again')}</Paragraph>
              {tResultCard.rich('contact-support', {
                link: (chunks) => (
                  <Link href={TELEGRAM_SUPPORT_LINK} target="_blank">
                    {chunks}
                  </Link>
                ),
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
