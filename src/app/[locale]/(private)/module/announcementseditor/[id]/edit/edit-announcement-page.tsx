"use client";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { AnnouncementFormValues } from "../../components/announcement-form";
import { useTranslations } from "next-intl";
import { updateAnnouncement } from "@/actions/announcement.actions";
import { AnnouncementEditorView } from "../../components/announcement-editor-view";
import { LIST_PATH } from "../../constants";
import { useServerErrorToast } from "@/hooks/use-server-error-toast";

interface Props {
    id: number;
    initialValues: AnnouncementFormValues;
    rolesData: string[];
    studyFormsData: string[];
    coursesData: number[];
}

export function EditAnnouncementPage({ id, initialValues, rolesData, studyFormsData, coursesData }: Props) {
    const t = useTranslations('private.announcementseditor');
  const { toast } = useToast();
  const router = useRouter();
  const { errorToast } = useServerErrorToast();

  const handleSubmit = async (values: AnnouncementFormValues) => {
    try {
        await updateAnnouncement(id, values);
        toast({ title: t('edit.success') });
        router.push(LIST_PATH);
    } catch {
        errorToast();
    }
  };

  return (
    <AnnouncementEditorView
      heading={t('edit.title')}
      initialValues={initialValues}
      rolesData={rolesData}
      studyFormsData={studyFormsData}
      coursesData={coursesData}
      onSubmit={handleSubmit}
    />
  );
}