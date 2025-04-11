import { ModuleInfoPage } from '@/app/[locale]/(private)/module/studysheet/[id]/page.content';
import { getMonitoringById } from '@/actions/monitoring.actions';

interface Props {
  params: Promise<{ id: string }>;
}
export default async function InfoPage({ params }: Props) {
  const { id } = await params;
  const creditModule = await getMonitoringById(id);
  console.log(creditModule);
  return <ModuleInfoPage creditModule={creditModule} />;
}
