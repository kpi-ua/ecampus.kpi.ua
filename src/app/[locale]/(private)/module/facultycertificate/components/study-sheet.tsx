'use client';

import React, { FC } from 'react';
import { Card } from '@/components/ui/card';

import { TableSheets } from '@/app/[locale]/(private)/module/studysheet/[id]/components';
import { useSearchParams } from 'next/navigation';
import {
  AllDocsTable,
  ApprovedDocsTable,
  PendingDocsTable,
  RejectedDocsTable,
} from '@/app/[locale]/(private)/module/facultycertificate/[id]/components';
import { DeanCeritificateKeys } from '@/app/[locale]/(private)/module/facultycertificate/[id]/constants';
import { DeanCertificate } from '@/types/models/dean/dean-certificate';

interface Props {
  allCertificates: DeanCertificate[];
  pendingCertificates: DeanCertificate[];
  rejectedCertificates: DeanCertificate[];
  approvedCertificates: DeanCertificate[];
}

export const StudySheet: FC<Props> = ({
  allCertificates,
  rejectedCertificates,
  pendingCertificates,
  approvedCertificates,
}) => {
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get('sheet') || DeanCeritificateKeys.All;

  return (
    <div className="mt-8 flex flex-col">
      <TableSheets module="facultycertificate" sheetList={Object.values(DeanCeritificateKeys)} />
      <Card className="rounded-b-6 col-span-full w-full rounded-t-none bg-white p-6 xl:col-span-5">
        {selectedTab === DeanCeritificateKeys.All && <AllDocsTable certificates={allCertificates} />}
        {selectedTab === DeanCeritificateKeys.Pending && <PendingDocsTable certificates={pendingCertificates} />}
        {selectedTab === DeanCeritificateKeys.Approved && <ApprovedDocsTable certificates={approvedCertificates} />}
        {selectedTab === DeanCeritificateKeys.Rejected && <RejectedDocsTable certificates={rejectedCertificates} />}
      </Card>
    </div>
  );
};
