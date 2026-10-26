'use client';

import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Heading4, Paragraph } from '@/components/typography';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

import { CuratorGroup } from '../types';
import { exportStudyGroups } from '../utils/export-study-groups';

interface Props {
  groups: CuratorGroup[];
}

export const StudyGroupsTable = ({ groups }: Props) => {
  const t = useTranslations('private.curatorlecturer');
  const { errorToast } = useServerErrorToast();
  const [search, setSearch] = useState('');
  const filteredGroups = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) {
      return groups;
    }

    return groups.filter((group) => group?.curatorName?.toLocaleLowerCase().includes(query));
  }, [groups, search]);

  const exportMutation = useMutation({
    mutationFn: exportStudyGroups,
    onError: () => errorToast(),
  });

  return (
    <Card className="w-full rounded-[20px] bg-white p-5 shadow-lg sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <Heading4 className="m-0 text-neutral-900">{t('title')}</Heading4>
        <Button
          variant="secondary"
          size="small"
          loading={exportMutation.isPending}
          onClick={() => exportMutation.mutate()}
        >
          <Download />
          {t('export')}
        </Button>
      </div>

      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={t('search-placeholder')}
        className="mb-5 h-9"
      />

      {filteredGroups.length === 0 ? (
        <Paragraph className="m-0 py-12 text-center text-sm text-neutral-500">{t('empty')}</Paragraph>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-0 hover:bg-transparent">
              <TableHead className="h-10 w-24">{t('table.group')}</TableHead>
              <TableHead className="h-10 w-20">{t('table.course')}</TableHead>
              <TableHead className="h-10 min-w-60">{t('table.curator')}</TableHead>
              <TableHead className="h-10 min-w-80">{t('table.description')}</TableHead>
              <TableHead className="h-10 min-w-32">{t('table.department')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.map((group) => (
              <TableRow key={group.groupId} className="border-0 even:bg-[#F7F8FF]">
                <TableCell className="py-4 font-normal">{group.name}</TableCell>
                <TableCell className="py-4">{group.course}</TableCell>
                <TableCell className="py-4">{group.curatorName ?? t('table.not-assigned')}</TableCell>
                <TableCell className="py-4">{group.description}</TableCell>
                <TableCell className="py-4">{group.departmentName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};
