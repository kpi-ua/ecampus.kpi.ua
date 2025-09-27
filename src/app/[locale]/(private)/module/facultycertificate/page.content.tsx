'use client';

import React, { useState, useTransition } from 'react';
import { DeanCeritificateKey } from './constants';
import { TableTabs } from '@/components/table-tabs/table-tabs';
import { Card } from '@/components/ui/card';
import { AllDocsTable } from './components/all-docs-table';
import { Certificate } from '@/types/models/certificate/certificate';
import { Input } from '@/components/ui/input';
import { MagnifyingGlassRegular } from '@/app/images';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  createdCertificates: Certificate[];
  allCertificates: Certificate[];
  approvedCertificates: Certificate[];
  rejectedCertificates: Certificate[];
  selectedTab: string;
  totalCount: number;
  searchFilter: string;
}

export default function FacultyCertificatePageContent({
  createdCertificates,
  allCertificates,
  approvedCertificates,
  rejectedCertificates,
  selectedTab,
  totalCount,
  searchFilter,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [_, startTransition] = useTransition();
  const [search, setSearch] = useState(searchFilter);

  const handleSearchChange = (value: string) => {
    setSearch(value);

    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    params.delete('page');

    startTransition(() => {
      router.push(`/module/facultycertificate?${params.toString()}`);
    });
  };

  return (
    <div className="mt-8 flex flex-col">
      <TableTabs module="facultycertificate" sheetList={Object.values(DeanCeritificateKey)} />
      <Card className="rounded-b-6 col-span-full w-full rounded-t-none bg-white p-6 xl:col-span-5">
        {selectedTab === DeanCeritificateKey.All && (
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
        {selectedTab === DeanCeritificateKey.Pending && <AllDocsTable certificates={createdCertificates} />}
        {selectedTab === DeanCeritificateKey.Approved && <AllDocsTable certificates={approvedCertificates} />}
        {selectedTab === DeanCeritificateKey.Rejected && <AllDocsTable certificates={rejectedCertificates} />}
      </Card>
    </div>
  );
}
