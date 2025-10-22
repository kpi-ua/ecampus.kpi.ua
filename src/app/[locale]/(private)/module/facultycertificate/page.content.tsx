'use client';

import { startTransition, useState } from 'react';
import { DeanCeritificateKey } from './constants';
import { Card } from '@/components/ui/card';
import { AllDocsTable } from './components/all-docs-table';
import { Certificate } from '@/types/models/certificate/certificate';
import { Input } from '@/components/ui/input';
import { MagnifyingGlassRegular } from '@/app/images';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'query-string';
import { Tabs, TabSheetTrigger, TabsList } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';

interface Props {
  createdCertificates: Certificate[];
  allCertificates: Certificate[];
  approvedCertificates: Certificate[];
  rejectedCertificates: Certificate[];
  totalCount: number;
  searchFilter: string;
}

export default function FacultyCertificatePageContent({
  createdCertificates,
  allCertificates,
  approvedCertificates,
  rejectedCertificates,
  totalCount,
  searchFilter,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSheet, setSelectedSheet] = useState(DeanCeritificateKey.All);

  const [search, setSearch] = useState(searchFilter);

  const t = useTranslations(`private.facultycertificate.tab`);

  const handleSearchChange = (value: string) => {
    setSearch(value);

    const params = qs.parse(searchParams.toString());
    if (value) {
      params.search = value;
    } else {
      delete params.search;
    }
    delete params.page;

    startTransition(() => {
      router.push(`/module/facultycertificate?${qs.stringify(params)}`);
    });
  };

  const sheetList = [
    { key: DeanCeritificateKey.All, amount: totalCount },
    { key: DeanCeritificateKey.Pending, amount: createdCertificates.length },
    { key: DeanCeritificateKey.Approved, amount: approvedCertificates.length },
    { key: DeanCeritificateKey.Rejected, amount: rejectedCertificates.length },
  ];
  return (
    <div className="flex flex-col">
      <Tabs value={selectedSheet} onValueChange={(value) => setSelectedSheet(value as DeanCeritificateKey)}>
        <TabsList className="rounded-none border-0 bg-transparent p-0">
          {sheetList.map((item) => (
            <TabSheetTrigger key={item.key} value={item.key}>
              {t(item.key)}
              <span className="bg-brand-100 ml-2 flex min-w-6 justify-center rounded-[4px] p-1">{item.amount}</span>
            </TabSheetTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card className="rounded-b-6 col-span-full w-full rounded-t-none bg-white p-6 xl:col-span-5">
        {selectedSheet === DeanCeritificateKey.All && (
          <>
            <div className="mb-4 flex">
              <Input
                icon={<MagnifyingGlassRegular />}
                placeholder="Пошук за імʼям студента, призначенням..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full max-w-md"
              />
            </div>
            <AllDocsTable certificates={allCertificates} totalCount={totalCount} />
          </>
        )}
        {selectedSheet === DeanCeritificateKey.Pending && <AllDocsTable certificates={createdCertificates} />}
        {selectedSheet === DeanCeritificateKey.Approved && <AllDocsTable certificates={approvedCertificates} />}
        {selectedSheet === DeanCeritificateKey.Rejected && <AllDocsTable certificates={rejectedCertificates} />}
      </Card>
    </div>
  );
}
