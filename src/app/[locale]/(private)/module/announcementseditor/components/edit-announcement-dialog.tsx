'use client';

import { useTranslations } from 'next-intl';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AnnouncementForm, AnnouncementFormValues } from './announcement-form';
import { updateAnnouncement } from '@/actions/announcement.actions';
import { useToast } from '@/hooks/use-toast';
import { AdminAnnouncementItem } from '@/types/models/announcement';

interface Props {
  /** Item to edit. `null` keeps the dialog closed. */
  item: AdminAnnouncementItem | null;
  rolesData: string[];
  studyFormsData: string[];
  coursesData: number[];
  onClose: () => void;
}

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

const buildDefaults = (item: AdminAnnouncementItem): AnnouncementFormValues => ({
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

export const EditAnnouncementDialog = ({
  item,
  rolesData,
  studyFormsData,
  coursesData,
  onClose,
}: Props) => {
  const t = useTranslations('private.announcementseditor.edit');
  const { toast } = useToast();

  const open = item !== null;

  const handleSubmit = async (values: AnnouncementFormValues) => {
    if (!item) return;
    await updateAnnouncement(item.announcement.id, values);
    toast({ title: t('success') });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        {item && (
          <AnnouncementForm
            rolesData={rolesData}
            studyFormsData={studyFormsData}
            coursesData={coursesData}
            defaultValues={buildDefaults(item)}
            onSubmit={handleSubmit}
            submitLabel={t('save')}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
