'use client';

import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { AnnouncementForm } from './announcement-form';
import type { AnnouncementFormValues } from './schema';

const LIST_PATH = '/module/announcementseditor';

interface EditorShellProps {
  heading: string;
  rolesData: string[];
  studyFormsData: string[];
  coursesData: number[];
  initialValues?: AnnouncementFormValues;
  onSubmit: (values: AnnouncementFormValues) => Promise<void>;
}

export const AnnouncementEditorView = ({
  heading,
  rolesData,
  studyFormsData,
  coursesData,
  initialValues,
  onSubmit,
}: EditorShellProps) => {
  const t = useTranslations('private.announcementseditor');

  return (
    <div className="mt-8">
      <div className="mb-4">
        <Button variant="tertiary" size="small" asChild>
          <Link href={LIST_PATH}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('actions.back')}
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold">{heading}</h3>
          <AnnouncementForm
            rolesData={rolesData}
            studyFormsData={studyFormsData}
            coursesData={coursesData}
            initialValues={initialValues}
            onSubmit={onSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
};