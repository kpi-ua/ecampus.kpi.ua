'use client';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Heading2, Heading6 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Certificate } from '@/types/models/certificate/certificate';
import dayjs from 'dayjs';
import { createCertificateRequest, getCertificatePDF } from '@/actions/certificates.actions';
import { CertificateStatusBadge } from '@/app/[locale]/(private)/module/studdoc/components/certificate-status-badge';
import { downloadFile } from '@/lib/utils';
import { dash } from 'radash';

const INTL_NAMESPACE = 'private.certificate';

interface Props {
  certificateTypes: string[];
  certificates: Certificate[];
}

export default function CertificatePageContent({ certificates, certificateTypes }: Props) {
  const t = useTranslations(INTL_NAMESPACE);
  const tEnums = useTranslations('global.enums.certificate-type');
  const tTable = useTranslations('public.verification.result.table');
  const tCert = useTranslations('private.certificate');

  const FormSchema = z.object({
    docType: z.string().trim().min(1),
    purpose: z.string().trim().optional(),
  });

  type FormData = z.infer<typeof FormSchema>;

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      docType: '',
      purpose: '',
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    await createCertificateRequest(data.docType, data.purpose);
    form.reset();
  };

  const handleDownload = async (id: number) => {
    const { filename, blob } = await getCertificatePDF(id);

    const url = URL.createObjectURL(blob);

    downloadFile(url, filename);
  };

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12 w-full px-2 sm:px-4 md:px-0">
        <Heading2>{t('title')}</Heading2>
        <Paragraph className="leading-sm mt-3 mb-7 max-w-full text-sm font-normal text-neutral-700 sm:max-w-2xl">
          {t('info')}
        </Paragraph>
        <div className="flex flex-col gap-5 lg:flex-row">
          <Card className="rounded-b-6 col-span-full flex h-fit flex-1 basis-1/3 flex-col gap-4 bg-white p-4 sm:gap-6 sm:p-6 md:p-9 xl:col-span-5">
            <Heading6>{tCert('orderTitle')}</Heading6>
            <Form {...form}>
              <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(handleFormSubmit)}>
                <FormField
                  control={form.control}
                  name="docType"
                  render={({ field }) => (
                    <FormItem className="w-full gap-2">
                      <FormLabel className="text-base" htmlFor="docType">
                        {tCert('docType')}
                      </FormLabel>
                      <Select onValueChange={field.onChange} {...field}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={tCert('docTypePlaceholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {certificateTypes.map((type, index) => (
                              <SelectItem key={index} value={type.toString()}>
                                {tEnums(dash(type))}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tCert('purpose')}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={tCert('purposePlaceholder')} className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="mt-3 ml-auto w-fit"
                  size="big"
                  disabled={!form.formState.isValid}
                  loading={form.formState.isSubmitting}
                >
                  {tCert('submit')}
                </Button>
              </form>
            </Form>
          </Card>

          <Card className="rounded-b-6 col-span-full flex w-full flex-[2] basis-2/3 flex-col gap-4 bg-white p-4 sm:gap-6 sm:p-6 md:p-9 xl:col-span-5">
            <Heading6>{tTable('title')}</Heading6>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tTable('type')}</TableHead>
                  <TableHead>{tTable('date')}</TableHead>
                  <TableHead>{tTable('status')}</TableHead>
                  <TableHead>{tTable('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.map((certificate) => (
                  <TableRow key={certificate.id}>
                    <TableCell className="w-[140px]">
                      <Paragraph className="m-0 text-sm font-normal">{tEnums(dash(certificate.type))}</Paragraph>
                      <Paragraph className="m-0 text-sm font-normal text-neutral-600">{certificate.purpose}</Paragraph>
                    </TableCell>
                    <TableCell className="w-[100px]">{dayjs(certificate.created).format('DD.MM.YYYY')}</TableCell>
                    <TableCell className="w-[100px]">
                      <CertificateStatusBadge
                        className="flex justify-center border text-center font-semibold"
                        status={certificate.status}
                      />
                    </TableCell>
                    <TableCell className="w-[100px]">
                      {certificate.status === 'Approved' && (
                        <Button variant="secondary" onClick={() => handleDownload(certificate.id)}>
                          {tTable('download')}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </SubLayout>
  );
}
