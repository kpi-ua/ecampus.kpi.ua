'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { useToast } from '@/hooks/use-toast';
import { AdminAnnouncementItem } from '@/types/models/announcement';
import { AnnouncementForm, AnnouncementFormValues } from './announcement-form';
import { AnnouncementsFilters } from './announcements-filters';
import { AnnouncementsTable } from './announcements-table';
import { DeleteConfirmDialog } from './delete-confirm-dialog';

interface Props {
  items: AdminAnnouncementItem[];
  total: number;
  page: number;
  pageSize: number;
  rolesData: string[];
  studyFormsData: string[];
  coursesData: number[];
}

type Mode = { kind: 'list' } | { kind: 'create' } | { kind: 'edit'; item: AdminAnnouncementItem };

// Format as local YYYY-MM-DD (the shape <input type="date"> expects).
// Avoids toISOString(), which converts to UTC and can shift the calendar
// day for any value that isn't already at UTC midnight.
const toIsoDate = (value: Date | string | undefined) => {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const buildInitialValues = (item: AdminAnnouncementItem): AnnouncementFormValues => ({
  announcement: {
    title: item.announcement.title,
    description: item.announcement.description ?? '',
    image: item.announcement.image ?? '',
    link: {
      title: item.announcement.link?.title ?? '',
      uri: item.announcement.link?.uri ?? '',
    },
    start: toIsoDate(item.announcement.start),
    end: toIsoDate(item.announcement.end),
    language: item.announcement.language ?? 'uk',
  },
  filter: {
    roles: item.filter.roles ?? [],
    studyForms: item.filter.studyForms ?? [],
    courses: item.filter.courses ?? [],
  },
});

export const AnnouncementManagement = ({
  items,
  total,
  page,
  pageSize,
  rolesData,
  studyFormsData,
  coursesData,
}: Props) => {
  const t = useTranslations('private.announcementseditor');
  const { toast } = useToast();

  const [mode, setMode] = useState<Mode>({ kind: 'list' });
  const [deletingItem, setDeletingItem] = useState<AdminAnnouncementItem | null>(null);

  const handleCreateSuccess = (id: number) => {
    toast({
      title: t('success.title'),
      description: t('success.message', { id }),
    });
    setMode({ kind: 'list' });
  };

  const handleEditSuccess = () => {
    toast({ title: t('edit.success') });
    setMode({ kind: 'list' });
  };

  if (mode.kind === 'create' || mode.kind === 'edit') {
    const isEdit = mode.kind === 'edit';
    return (
      <div className="mt-8">
        <div className="mb-4">
          <Button variant="tertiary" size="small" onClick={() => setMode({ kind: 'list' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('actions.back')}
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">{isEdit ? t('edit.title') : t('create.title')}</h3>
            <AnnouncementForm
              // Force a remount when switching items so RHF picks up the new defaults
              // — useForm only applies them on mount.
              key={isEdit ? mode.item.announcement.id : 'create'}
              rolesData={rolesData}
              studyFormsData={studyFormsData}
              coursesData={coursesData}
              id={isEdit ? mode.item.announcement.id : undefined}
              initialValues={isEdit ? buildInitialValues(mode.item) : undefined}
              submitLabel={isEdit ? t('edit.save') : undefined}
              onSuccess={isEdit ? handleEditSuccess : handleCreateSuccess}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setMode({ kind: 'create' })} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t('create.button')}
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-4 md:p-6">
          <AnnouncementsFilters />
          <AnnouncementsTable
            items={items}
            onEdit={(item) => setMode({ kind: 'edit', item })}
            onDelete={setDeletingItem}
          />
          {total > 0 && <PaginationWithLinks page={page} pageSize={pageSize} totalCount={total} />}
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        id={deletingItem?.announcement.id ?? null}
        title={deletingItem?.announcement.title}
        onClose={() => setDeletingItem(null)}
      />
    </div>
  );
};
