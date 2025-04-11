'use client';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProfilePicture } from '@/components/ui/profile-picture';
import { Link } from '@/i18n/routing';
import { ExternalMaterials } from '@/types/models/current-control/materials';
import { useTranslations } from 'next-intl';

interface ExternalMaterialsTableProps {
  externalMaterials: ExternalMaterials[];
  t: ReturnType<typeof useTranslations>;
}

export const ExternalMaterialsTable: React.FC<ExternalMaterialsTableProps> = ({ externalMaterials, t }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('date')}</TableHead>
          <TableHead>{t('link')}</TableHead>
          <TableHead>{t('lecturer')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {externalMaterials.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.date}</TableCell>
            <TableCell>
              <Link href={row.url}>{row.name}</Link>
            </TableCell>
            <TableCell className="max-w-[360px]">
              <div className="flex items-center gap-3">
                <ProfilePicture size="xs" src={row.lecturer.photo} />
                <span className="text-sm font-semibold text-basic-black">{row.lecturer.fullName}</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
