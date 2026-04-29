'use client';

import { useTranslations } from 'next-intl';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AnnouncementForm, AnnouncementFormValues } from './announcement-form';
import { updateAnnouncement } from '@/actions/announcement.actions';
import { useToast } from '@/hooks/use-toast';
import { Group } from '@/types/models/group';
import { AdminAnnouncementItem } from '@/types/models/announcement';

interface Props {
  /** Item to edit. `null` keeps the dialog closed. */
  item: AdminAnnouncementItem | null;
  rolesData: string[];
  studyFormsData: string[];
  groupsData: Group[];
  coursesData: number[];
  onClose: () => void;
}

const toIsoDate = (value: Date | string | undefined) => {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
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
    // BE doesn't expose `groups` on AdminAnnouncementItem; the form still
    // shows the field today (KB-1256 will remove it). Default to empty.
    groups: [],
    studyForms: item.filter.studyForms ?? [],
    courses: item.filter.courses ?? [],
  },
});

export function EditAnnouncementDialog({
  item,
  rolesData,
  studyFormsData,
  groupsData,
  coursesData,
  onClose,
}: Props) {
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
            groupsData={groupsData}
            coursesData={coursesData}
            defaultValues={buildDefaults(item)}
            onSubmit={handleSubmit}
            submitLabel={t('save')}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
