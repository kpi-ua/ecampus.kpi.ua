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
  const { employeeId, setEmployeeId, startDate, setStartDate, endDate, setEndDate, handleAssign, isAssigning } =
    useCuratorAssignment(group);
  const departmentLecturers = lecturers.filter((item) => item.department.id === group.departmentId);

  return (
    <div className="flex flex-col gap-8 rounded-[24px] bg-neutral-50 p-5 sm:px-8 sm:py-6">
      <Heading4 className="m-0 text-base font-semibold">{t('assign.title')}</Heading4>
      <div className="grid gap-4 lg:grid-cols-[minmax(200px,1fr)_200px_200px_auto] lg:items-end">
        <div className="flex min-w-0 flex-col gap-1">
          <Paragraph className="m-0 text-sm font-normal text-neutral-500">{t('assign.label')}</Paragraph>
          <Select value={employeeId} onValueChange={setEmployeeId}>
            <SelectTrigger variant="small" className="bg-white text-sm">
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
        <div className="flex min-w-0 flex-col gap-1">
          <Paragraph className="m-0 text-sm font-normal text-neutral-500">{t('assign.start-date')}</Paragraph>
          <Input
            className="h-9 bg-white text-sm"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <Paragraph className="m-0 text-sm font-normal text-neutral-500">{t('assign.end-date')}</Paragraph>
          <Input
            className="h-9 bg-white text-sm"
            type="date"
            min={startDate}
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
          />
        </div>
        <Button variant="primary" size="small" className="h-9" loading={isAssigning} onClick={handleAssign}>
          {t('assign.submit')}
        </Button>
      </div>
      <CuratorAssignmentHistory groupId={group.groupId} />
    </div>
  );
};
