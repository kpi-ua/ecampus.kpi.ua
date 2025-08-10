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
import { LoadingState } from '@/app/[locale]/validate-certificate/components/loading-state';
import { EmptyState } from '@/app/[locale]/validate-certificate/components/empty-state';
import { CertificateDetails } from '@/app/[locale]/validate-certificate/components/certificate-details';

export function CertificateVerifier() {
  const autoSubmittedRef = useRef(false);

  const [result, setResult] = useState<CertificateVerificationResult | null>(null);

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
      setResult(null);
      const res = await verifyCertificate(data.certificateId);
      form.reset();
      setResult(res);
    },
    [form],
  );

  useEffect(() => {
    if (!token || autoSubmittedRef.current) return;

    form.setValue('certificateId', token, { shouldValidate: true, shouldDirty: false });
    autoSubmittedRef.current = true;
    form.handleSubmit(handleFormSubmit)();
  }, [searchParams, form, handleFormSubmit, token]);

  const tResultCard = useTranslations('public.verification.result');
  const tSearchCard = useTranslations('public.verification.search');

  const searchValue = form.watch('certificateId');
  const isLoading = result === null && form.formState.isSubmitting;
  const isEmpty = result === null && searchValue === '';
  const isApproved = result?.status === 'Approved';
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
          {isLoading && <LoadingState t={tResultCard} />}

          {isEmpty && <EmptyState t={tResultCard} />}

          {isApproved && <CertificateDetails result={result} t={tResultCard} />}

          {searchValue && form.formState.isSubmitted && !isLoading && !isApproved && (
            <div className="text-center text-muted-foreground">
              <div className="font-medium text-red-600">{tResultCard('notfound')}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
