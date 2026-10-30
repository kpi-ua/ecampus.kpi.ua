'use client';

import dayjs from 'dayjs';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { PencilRegular } from '@/app/images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTableSort } from '@/hooks/use-table-sort';
import { useUserCategoryLabel } from '@/hooks/use-user-category-label';
import { Link } from '@/i18n/routing';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { isOutdated } from '@/lib/date.utils';
import { formatDate } from '@/lib/utils';
import { AdminAnnouncementItem } from '@/types/models/announcement';

import { coursesText, formatFilterCell, rolesText, studyFormsText } from './utils';

interface Props {
  items: AdminAnnouncementItem[];
  onDelete: (item: AdminAnnouncementItem) => void;
}

export const AnnouncementsTable = ({ items, onDelete }: Props) => {
  const t = useTranslations('private.announcementseditor');
  const roleLabel = useUserCategoryLabel();
  const noRestriction = t('table.noRestriction');

  const { sortedRows, sortHandlers } = useTableSort(
    items,
    (row, header) => {
      const key = header as 'title' | 'start';
      return key === 'title' ? row.announcement.title : dayjs(row.announcement.start).valueOf();
    },
    ['title', 'start'] as unknown as Array<keyof AdminAnnouncementItem & string>,
  );

  if (items.length === 0) {
    return <p className="py-12 text-center text-sm text-muted-foreground">{t('table.empty')}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead sortHandlers={sortHandlers} sortHeader="title">
            {t('table.title')}
          </TableHead>
          <TableHead className="w-20">{t('table.language')}</TableHead>
          <TableHead sortHandlers={sortHandlers} sortHeader="start" className="w-48 min-w-32">
            {t('table.period')}
          </TableHead>
          <TableHead className="w-28">{t('table.status')}</TableHead>
          <TableHead className="max-w-40 min-w-28 text-start">{t('table.roles')}</TableHead>
          <TableHead className="max-w-40 min-w-28 text-start">{t('table.studyForms')}</TableHead>
          <TableHead className="max-w-32 min-w-24 text-start">{t('table.courses')}</TableHead>
          <TableHead className="w-28 text-right">{t('table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRows.map((item) => {
          const { announcement, filter } = item;
          const outdated = isOutdated(announcement.end);

          return (
            <TableRow key={announcement.id}>
              <TableCell className="max-w-md font-medium">
                <span className="line-clamp-2">{announcement.title}</span>
              </TableCell>
              <TableCell>
                <Badge variant="neutral" className="uppercase">
                  {announcement.language ?? EMPTY_VALUE}
                </Badge>
              </TableCell>
              <TableCell className="text-sm whitespace-nowrap">
                {formatDate(announcement.start)} – {formatDate(announcement.end)}
              </TableCell>
              <TableCell>
                <Badge variant={outdated ? 'default' : 'success'}>
                  {outdated ? t('status.outdated') : t('status.active')}
                </Badge>
              </TableCell>
              <TableCell className="text-start align-middle text-muted-foreground">
                {formatFilterCell(rolesText(filter, roleLabel), noRestriction)}
              </TableCell>
              <TableCell className="text-start align-middle text-muted-foreground">
                {formatFilterCell(studyFormsText(filter), noRestriction)}
              </TableCell>
              <TableCell className="text-start align-middle text-muted-foreground">
                {formatFilterCell(coursesText(filter), noRestriction)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button variant="tertiary" size="small" asChild>
                    <Link href={`/module/announcementseditor/${announcement.id}/edit`}>
                      <PencilRegular />
                    </Link>
                  </Button>
                  <Button variant="tertiary" size="small" onClick={() => onDelete(item)}>
                    <Trash2 className="text-other-red" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
