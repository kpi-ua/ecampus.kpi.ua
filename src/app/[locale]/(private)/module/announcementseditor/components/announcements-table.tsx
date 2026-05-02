'use client';

import dayjs from 'dayjs';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { PencilRegular } from '@/app/images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { isOutdated } from '@/lib/date.utils';
import { AdminAnnouncementItem, AnnouncementFilter } from '@/types/models/announcement';

interface Props {
  items: AdminAnnouncementItem[];
  onDelete: (item: AdminAnnouncementItem) => void;
}

const formatFilterCell = (value: string, noRestriction: string) => (
  <span className="block line-clamp-2 text-center text-sm" title={value || noRestriction}>
    {value || noRestriction}
  </span>
);

const rolesText = (filter: AnnouncementFilter) =>
  filter.roles.length ? filter.roles.join(', ') : '';

const studyFormsText = (filter: AnnouncementFilter) =>
  filter.studyForms.length ? filter.studyForms.join(', ') : '';

const coursesText = (filter: AnnouncementFilter) =>
  filter.courses.length ? filter.courses.map((c) => String(c)).join(', ') : '';

export const AnnouncementsTable = ({ items, onDelete }: Props) => {
  const t = useTranslations('private.announcementseditor');
  const noRestriction = t('table.noRestriction');

  if (items.length === 0) {
    return <p className="text-muted-foreground py-12 text-center text-sm">{t('table.empty')}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('table.title')}</TableHead>
          <TableHead className="w-20">{t('table.language')}</TableHead>
          <TableHead className="w-48 min-w-32">{t('table.period')}</TableHead>
          <TableHead className="w-28">{t('table.status')}</TableHead>
          <TableHead className="min-w-28 max-w-40 text-center">{t('table.roles')}</TableHead>
          <TableHead className="min-w-28 max-w-40 text-center">{t('table.studyForms')}</TableHead>
          <TableHead className="min-w-24 max-w-32 text-center">{t('table.courses')}</TableHead>
          <TableHead className="w-28 text-right">{t('table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          const { announcement, filter } = item;
          const outdated = isOutdated(announcement.end);

          return (
            <TableRow key={announcement.id}>
              <TableCell className="max-w-md font-medium">
                <span className="line-clamp-2">{announcement.title}</span>
              </TableCell>
              <TableCell>
                <Badge variant="neutral" className="uppercase">
                  {announcement.language ?? '—'}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm">
                {dayjs(announcement.start).format('DD.MM.YYYY')} – {dayjs(announcement.end).format('DD.MM.YYYY')}
              </TableCell>
              <TableCell>
                <Badge variant={outdated ? 'default' : 'success'}>
                  {outdated ? t('status.outdated') : t('status.active')}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground align-middle text-center">
                {formatFilterCell(rolesText(filter), noRestriction)}
              </TableCell>
              <TableCell className="text-muted-foreground align-middle text-center">
                {formatFilterCell(studyFormsText(filter), noRestriction)}
              </TableCell>
              <TableCell className="text-muted-foreground align-middle text-center">
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
