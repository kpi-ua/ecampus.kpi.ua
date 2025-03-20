'use client';
import { ModuleInfoPage } from '@/app/[locale]/(private)/module/studysheet/[id]/page.content';

interface Props {
  params: Promise<{ id: string }>;
}
export default async function InfoPage({ params }: Props) {
  const { id } = await params;
  return <ModuleInfoPage />;
}
