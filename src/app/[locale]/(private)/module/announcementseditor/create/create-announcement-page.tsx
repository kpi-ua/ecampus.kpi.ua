'use client';

import { createAnnouncement } from "@/actions/announcement.actions";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { AnnouncementEditorView } from "../components/announcement-editor-view";
import { AnnouncementFormValues } from "../components/announcement-form";
import { LIST_PATH } from "../constants";
interface Props {
    rolesData: string[];
    studyFormsData: string[];
    coursesData: number[];
}

export function CreateAnnouncementPage({ rolesData, studyFormsData, coursesData }: Props) {
    const t = useTranslations('private.announcementseditor');
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (values: AnnouncementFormValues) => {
    const id = await createAnnouncement(values);
    toast({
      title: t('success.title'),
      description: t('success.message', { id }),
    });
    router.push(LIST_PATH);
  };

  return (
    <AnnouncementEditorView
      heading={t('create.title')}
      rolesData={rolesData}
      studyFormsData={studyFormsData}
      coursesData={coursesData}
      onSubmit={handleSubmit}
    />
  );
}