'use client';

import { useTranslations } from 'next-intl';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AnnouncementForm, AnnouncementFormValues } from './announcement-form';
import { createAnnouncement } from '@/actions/announcement.actions';
import { useToast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onClose: () => void;
  rolesData: string[];
  studyFormsData: string[];
  coursesData: number[];
}

export const CreateAnnouncementDialog = ({
  open,
  onClose,
  rolesData,
  studyFormsData,
  coursesData,
}: Props) => {
  const t = useTranslations('private.announcementseditor');
  const { toast } = useToast();

  const handleSubmit = async (values: AnnouncementFormValues) => {
    const id = await createAnnouncement(values);
    toast({
      title: t('success.title'),
      description: t('success.message', { id }),
    });
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
          <DialogTitle>{t('create.title')}</DialogTitle>
        </DialogHeader>
        <AnnouncementForm
          rolesData={rolesData}
          studyFormsData={studyFormsData}
          coursesData={coursesData}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
