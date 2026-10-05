'use client';

import { useTranslations } from 'next-intl';

import { Heading4, Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { CuratorGroup, CuratorLecturer } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { useCuratorAssignment } from '@/app/[locale]/(private)/module/curatorlecturer/components/administration/hooks/use-curator-assignment';
import { CuratorAssignmentHistory } from './curator-assignment-history';

interface Props {
  group: CuratorGroup;
  lecturers: CuratorLecturer[];
}

export const CuratorAssignmentPanel = ({ group, lecturers }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator.administration');
  const {
    employeeId,
    setEmployeeId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    handleAssign,
    isAssigning,
  } = useCuratorAssignment(group);
  const departmentLecturers = lecturers.filter((item) => item.department.id === group.departmentId);

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-neutral-50 p-6">
      <Heading4 className="m-0">{t('assign.title')}</Heading4>
      <div className="grid gap-4 lg:grid-cols-[minmax(280px,1fr)_200px_200px_auto] lg:items-end">
        <div className="flex flex-col gap-2">
          <Paragraph className="m-0 text-sm font-semibold">{t('assign.label')}</Paragraph>
          <Select value={employeeId} onValueChange={setEmployeeId}>
            <SelectTrigger>
              <SelectValue placeholder={t('assign.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              {departmentLecturers.map((lecturer) => (
                <SelectItem key={lecturer.employeeId} value={lecturer.employeeId.toString()}>
                  {lecturer.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Paragraph className="m-0 text-sm font-semibold">{t('assign.start-date')}</Paragraph>
          <Input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Paragraph className="m-0 text-sm font-semibold">{t('assign.end-date')}</Paragraph>
          <Input type="date" min={startDate} value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        </div>
        <Button
          variant="primary"
          size="medium"
          loading={isAssigning}
          onClick={handleAssign}
        >
          {t('assign.submit')}
        </Button>
      </div>
      <CuratorAssignmentHistory groupId={group.groupId} />
    </div>
  );
};
