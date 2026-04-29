'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PaginationWithLinks } from '@/components/ui/pagination-with-links';
import { AdminAnnouncementItem } from '@/types/models/announcement';
import { Group } from '@/types/models/group';
import { AnnouncementsFilters } from './announcements-filters';
import { AnnouncementsTable } from './announcements-table';
import { CreateAnnouncementDialog } from './create-announcement-dialog';
import { EditAnnouncementDialog } from './edit-announcement-dialog';
import { DeleteConfirmDialog } from './delete-confirm-dialog';

interface Props {
  items: AdminAnnouncementItem[];
  total: number;
  page: number;
  pageSize: number;
  rolesData: string[];
  studyFormsData: string[];
  groupsData: Group[];
  coursesData: number[];
}

export function AnnouncementManagement({
  items,
  total,
  page,
  pageSize,
  rolesData,
  studyFormsData,
  groupsData,
  coursesData,
}: Props) {
  const t = useTranslations('private.announcementseditor');

  const [createOpen, setCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminAnnouncementItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<AdminAnnouncementItem | null>(null);

  return (
    <div className="mt-6">
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setCreateOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t('create.button')}
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-4 md:p-6">
          <AnnouncementsFilters />
          <AnnouncementsTable
            items={items}
            onEdit={setEditingItem}
            onDelete={setDeletingItem}
          />
          {total > 0 && (
            <PaginationWithLinks page={page} pageSize={pageSize} totalCount={total} />
          )}
        </CardContent>
      </Card>

      <CreateAnnouncementDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        rolesData={rolesData}
        studyFormsData={studyFormsData}
        groupsData={groupsData}
        coursesData={coursesData}
      />

      <EditAnnouncementDialog
        item={editingItem}
        rolesData={rolesData}
        studyFormsData={studyFormsData}
        groupsData={groupsData}
        coursesData={coursesData}
        onClose={() => setEditingItem(null)}
      />

      <DeleteConfirmDialog
        id={deletingItem?.announcement.id ?? null}
        title={deletingItem?.announcement.title}
        onClose={() => setDeletingItem(null)}
      />
    </div>
  );
}
