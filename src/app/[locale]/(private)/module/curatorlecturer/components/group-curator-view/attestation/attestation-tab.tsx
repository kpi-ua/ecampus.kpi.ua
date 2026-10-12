'use client';

import { useMutation } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { CuratorFilters } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { exportStudentAttestations } from '@/app/[locale]/(private)/module/curatorlecturer/utils/export-student-attestations';
import { exportDisciplineAttestations } from '@/app/[locale]/(private)/module/curatorlecturer/utils/export-discipline-attestations';
import { AttestationControls } from './attestation-controls';
import { AttestationStudents } from './attestation-students';
import { AttestationDisciplines } from './attestation-disciplines';
import {
  AttestationFiltersProvider,
  useAttestationFilters,
} from '@/app/[locale]/(private)/module/curatorlecturer/components/group-curator-view/attestation/hooks/use-attestation-filters';

interface Props {
  groupId: number;
  groupName: string;
  filters: CuratorFilters;
  defaultYearId: number;
}

export const AttestationTab = ({ defaultYearId, ...props }: Props) => (
  <AttestationFiltersProvider defaultYearId={defaultYearId}>
    <AttestationTabContent {...props} />
  </AttestationFiltersProvider>
);
const AttestationTabContent = ({ groupId, groupName, filters }: Omit<Props, 'defaultYearId'>) => {
  const t = useTranslations('private.curatorlecturer.group-curator');
  const state = useAttestationFilters();
  const { errorToast } = useServerErrorToast();
  const exportId = useId();
  const studentsExport = useMutation({
    mutationFn: () => exportStudentAttestations(groupId, state.params),
    onError: () => errorToast(),
  });
  const disciplinesExport = useMutation({
    mutationFn: () => exportDisciplineAttestations(groupId, state.params),
    onError: () => errorToast(),
  });
  return (
    <Tabs defaultValue="students" className="flex flex-col gap-6">
      <AttestationControls
        groupName={groupName}
        filters={filters}
        exportButton={
          <>
            <TabsContent value="students" role="presentation" id={`${exportId}-students`} className="mt-0">
              <Button
                variant="secondary"
                size="small"
                loading={studentsExport.isPending}
                disabled={!state.enabled}
                onClick={() => studentsExport.mutate()}
              >
                <Download />
                {t('export')}
              </Button>
            </TabsContent>
            <TabsContent value="disciplines" role="presentation" id={`${exportId}-disciplines`} className="mt-0">
              <Button
                variant="secondary"
                size="small"
                loading={disciplinesExport.isPending}
                disabled={!state.enabled}
                onClick={() => disciplinesExport.mutate()}
              >
                <Download />
                {t('export')}
              </Button>
            </TabsContent>
          </>
        }
      />
      <TabsContent value="students" className="mt-0">
        <AttestationStudents groupId={groupId} filters={filters} />
      </TabsContent>
      <TabsContent value="disciplines" className="mt-0">
        <AttestationDisciplines groupId={groupId} filters={filters} />
      </TabsContent>
    </Tabs>
  );
};
