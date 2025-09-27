'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { AnnouncementForm } from './announcement-form';
import { Group } from '@/types/models/group';
import { Subdivision } from '@/types/models/subdivision';

interface Props {
  rolesData: string[];
  studyFormsData: string[];
  groupsData: Group[];
  subdivisionsData: Subdivision[];
  coursesData: number[];
}

export function AnnouncementManagement({
  rolesData,
  studyFormsData,
  groupsData,
  subdivisionsData,
  coursesData,
}: Props) {
  const t = useTranslations('private.announcements');
  const [showForm, setShowForm] = useState(false);
  const [createdAnnouncementId, setCreatedAnnouncementId] = useState<number | null>(null);

  const handleCreateClick = () => {
    setShowForm(true);
    setCreatedAnnouncementId(null);
  };

  const handleFormSuccess = (announcementId: number) => {
    setCreatedAnnouncementId(announcementId);
    // setShowForm(false);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setCreatedAnnouncementId(null);
  };

  if (showForm) {
    return (
      <AnnouncementForm
        rolesData={rolesData}
        studyFormsData={studyFormsData}
        groupsData={groupsData}
        subdivisionsData={subdivisionsData}
        coursesData={coursesData}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="mt-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-6 text-center">
              <h3 className="mb-2 text-lg font-semibold">{t('create.title')}</h3>
              <p className="text-gray-600">{t('create.description')}</p>
            </div>

            <Button onClick={handleCreateClick} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t('create.button')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {createdAnnouncementId && (
        <Card className="mt-4">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="mb-2 font-semibold text-green-600">{t('success.title')}</div>
              <div className="text-sm text-gray-600">{t('success.message', { id: createdAnnouncementId })}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
