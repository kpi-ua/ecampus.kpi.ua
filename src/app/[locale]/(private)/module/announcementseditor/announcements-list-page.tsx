'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { AdminAnnouncementItem } from '@/types/models/announcement';

import { AnnouncementsFilters } from './components/announcements-filters';
import { AnnouncementsTable } from './components/announcements-table/announcements-table';
import { DeleteConfirmDialog } from './components/delete-confirm-dialog';
import { deleteAnnouncement } from '@/actions/announcement.actions';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useToast } from '@/hooks/use-toast';

const CREATE_PATH = '/module/announcementseditor/create';

interface Props {
  items: AdminAnnouncementItem[];
  total: number;
  page: number;
  pageSize: number;
}

export const AnnouncementsListPage = ({ items, total, page, pageSize }: Props) => {
  const t = useTranslations('private.announcementseditor');
  const [deletingItem, setDeletingItem] = useState<AdminAnnouncementItem | null>(null);
  const { errorToast } = useServerErrorToast();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    try {
      await deleteAnnouncement(id);
      toast({ title: t('delete.success') });
      setDeletingItem(null);
    } catch {
      errorToast();
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button asChild className="flex items-center gap-2">
          <Link href={CREATE_PATH}>
            <Plus className="h-4 w-4" />
            {t('create.button')}
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-4 md:p-6">
          <AnnouncementsFilters />
          <AnnouncementsTable items={items} onDelete={setDeletingItem} />
          {total > 0 && <PaginationWithLinks page={page} pageSize={pageSize} totalCount={total} />}
        </CardContent>
      </Card>

      {deletingItem && (
        <DeleteConfirmDialog
          title={deletingItem.announcement.title}
          onClose={() => setDeletingItem(null)}
          onConfirm={() => handleDelete(deletingItem.announcement.id)}
        />
      )}
    </>
  );
};
