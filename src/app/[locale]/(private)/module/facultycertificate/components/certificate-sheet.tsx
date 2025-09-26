'use client';

import React, { FC } from 'react';
import { Card } from '@/components/ui/card';

import { useSearchParams } from 'next/navigation';
import { DeanCeritificateKey } from '@/app/[locale]/(private)/module/facultycertificate/constants';
import { AllDocsTable } from '@/app/[locale]/(private)/module/facultycertificate/components/all-docs-table';
import { TableTabs } from '@/components/table-tabs/table-tabs';
import { Certificate } from '@/types/models/certificate/certificate';

interface Props {
  allCertificates: Certificate[];
  createdCertificates: Certificate[];
  rejectedCertificates: Certificate[];
  approvedCertificates: Certificate[];
}

export const CertificateSheet: FC<Props> = ({
  allCertificates,
  rejectedCertificates,
  createdCertificates,
  approvedCertificates,
}) => {
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get('tab') || DeanCeritificateKey.All;

  return (
    <div className="mt-8 flex flex-col">
      <TableTabs module="facultycertificate" sheetList={Object.values(DeanCeritificateKey)} />
      <Card className="rounded-b-6 col-span-full w-full rounded-t-none bg-white p-6 xl:col-span-5">
        {selectedTab === DeanCeritificateKey.All && <AllDocsTable certificates={allCertificates} />}
        {selectedTab === DeanCeritificateKey.Pending && <AllDocsTable certificates={createdCertificates} />}
        {selectedTab === DeanCeritificateKey.Approved && <AllDocsTable certificates={approvedCertificates} />}
        {selectedTab === DeanCeritificateKey.Rejected && <AllDocsTable certificates={rejectedCertificates} />}
      </Card>
    </div>
  );
};
