'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { AnnouncementForm } from './announcement-form';
import { Group } from '@/types/models/group';
import { Subdivision } from '@/types/models/subdivision';
import { useToast } from '@/hooks/use-toast';

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
  const t = useTranslations('private.announcementseditor');
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const handleCreateClick = () => {
    setShowForm(true);
  };

  const handleFormSuccess = (announcementId: number) => {
    toast({
      title: t('success.title'),
      description: t('success.message', { id: announcementId }),
    });
    setShowForm(false);
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
    </div>
  );
}
