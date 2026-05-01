'use client';

import dayjs from 'dayjs';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { PencilRegular } from '@/app/images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { isOutdated } from '@/lib/date.utils';
import { AdminAnnouncementItem, AnnouncementFilter } from '@/types/models/announcement';

interface Props {
  items: AdminAnnouncementItem[];
  onEdit: (item: AdminAnnouncementItem) => void;
  onDelete: (item: AdminAnnouncementItem) => void;
}

const toDate = (value: Date | string | undefined): Date | undefined => {
  if (!value) return undefined;
  const date = typeof value === 'string' ? new Date(value) : value;
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const formatPeriod = (start?: Date | string, end?: Date | string) => {
  const s = toDate(start);
  const e = toDate(end);
  if (!s || !e) return '—';
  return `${dayjs(s).format('DD.MM.YYYY')} – ${dayjs(e).format('DD.MM.YYYY')}`;
};

const summariseFilter = (filter: AnnouncementFilter, fallback: string): string => {
  const parts: string[] = [];
  if (filter.roles?.length) parts.push(filter.roles.join(', '));
  if (filter.studyForms?.length) parts.push(filter.studyForms.join(', '));
  if (filter.courses?.length) parts.push(filter.courses.join(', '));
  return parts.length === 0 ? fallback : parts.join(' • ');
};

export const AnnouncementsTable = ({ items, onEdit, onDelete }: Props) => {
  const t = useTranslations('private.announcementseditor');

  if (items.length === 0) {
    return <p className="text-muted-foreground py-12 text-center text-sm">{t('table.empty')}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('table.title')}</TableHead>
          <TableHead className="w-20">{t('table.language')}</TableHead>
          <TableHead className="w-56">{t('table.period')}</TableHead>
          <TableHead className="w-28">{t('table.status')}</TableHead>
          <TableHead>{t('table.targeting')}</TableHead>
          <TableHead className="w-28 text-right">{t('table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          const { announcement, filter } = item;
          const outdated = isOutdated(toDate(announcement.end));
          const targeting = summariseFilter(filter, t('table.targetingEveryone'));

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
              <TableCell className="whitespace-nowrap">{formatPeriod(announcement.start, announcement.end)}</TableCell>
              <TableCell>
                <Badge variant={outdated ? 'default' : 'success'}>
                  {outdated ? t('status.outdated') : t('status.active')}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground max-w-sm">
                <span className="line-clamp-1">{targeting}</span>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button variant="tertiary" size="small" onClick={() => onEdit(item)} aria-label={t('actions.edit')}>
                    <PencilRegular />
                  </Button>
                  <Button
                    variant="tertiary"
                    size="small"
                    onClick={() => onDelete(item)}
                    aria-label={t('actions.delete')}
                  >
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
