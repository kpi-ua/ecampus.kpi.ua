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
    const blob = await getCertificatePDF(id);
    const url = URL.createObjectURL(blob);

    downloadFile(url, 'certif.pdf');
  };

  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-12 w-full px-2 sm:px-4 md:px-0">
        <Heading2>{t('title')}</Heading2>
        <Paragraph className="mb-7 mt-3 max-w-full text-sm font-normal leading-sm text-neutral-700 sm:max-w-2xl">
          {t('info')}
        </Paragraph>
        <div className="flex flex-col gap-5 lg:flex-row">
          <Card className="rounded-b-6 col-span-full flex flex-1 basis-1/3 flex-col gap-4 bg-white p-4 sm:gap-6 sm:p-6 md:p-9 xl:col-span-5">
            <Heading6>Створення замовлення:</Heading6>
            <Form {...form}>
              <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(handleFormSubmit)}>
                <FormField
                  control={form.control}
                  name="docType"
                  render={({ field }) => (
                    <FormItem className="w-full gap-2">
                      <FormLabel className="text-base" htmlFor="docType">
                        Тип довідки
                      </FormLabel>
                      <Select onValueChange={field.onChange} {...field}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="оберіть тип довідки" />
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
                      <FormLabel>Коментар / мета довідки</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Наприклад: для посольства Франції" className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="ml-auto mt-3 w-fit"
                  size="big"
                  disabled={!form.formState.isValid}
                  loading={form.formState.isSubmitting}
                >
                  Замовити
                </Button>
              </form>
            </Form>
          </Card>

          <Card className="rounded-b-6 col-span-full flex w-full flex-[2] basis-2/3 flex-col gap-4 bg-white p-4 sm:gap-6 sm:p-6 md:p-9 xl:col-span-5">
            <Heading6>Історія замовлень:</Heading6>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Тип довідки</TableHead>
                  <TableHead>Дата запиту</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дії</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.map((certificate) => (
                  <TableRow key={certificate.id}>
                    <TableCell className="w-[140px]">
                      {tEnums(dash(certificate.type))}
                      {certificate.purpose}
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
                          Завантажити PDF
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
