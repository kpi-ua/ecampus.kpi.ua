'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { assignGroupCurator, getCuratorAssignments } from '@/actions/curator.actions';
import { Heading4, Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useToast } from '@/hooks/use-toast';

import { CuratorGroup, CuratorLecturer } from '../types';

interface Props {
  group: CuratorGroup;
  lecturers: CuratorLecturer[];
  onAssigned: (employeeId: number, curatorName: string) => void;
}

export const CuratorAssignmentPanel = ({ group, lecturers, onAssigned }: Props) => {
  const t = useTranslations('private.curator.lecturer.administration');
  const { errorToast } = useServerErrorToast();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const historyKey = ['curator', 'administration', group.groupId, 'assignments'] as const;
  const history = useQuery({ queryKey: historyKey, queryFn: () => getCuratorAssignments(group.groupId) });
  const assignment = useMutation({
    mutationFn: () => assignGroupCurator(group.groupId, Number(employeeId), startDate, endDate),
    onSuccess: async () => {
      const lecturer = lecturers.find((item) => item.employeeId === Number(employeeId));
      onAssigned(Number(employeeId), lecturer?.fullName ?? '');
      await queryClient.invalidateQueries({ queryKey: historyKey });
      toast({ title: t('success.title'), description: t('success.description', { group: group.name }) });
    },
    onError: () => errorToast(),
  });

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
              {lecturers
                .filter((item) => item.departmentId === group.departmentId)
                .map((lecturer) => (
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
          loading={assignment.isPending}
          disabled={!employeeId || !startDate || !endDate || endDate < startDate}
          onClick={() => assignment.mutate()}
        >
          {t('assign.submit')}
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        <Heading4 className="m-0">{t('history.title')}</Heading4>
        {history.isFetching ? (
          <LoaderCircle className="size-5 animate-spin" />
        ) : history.data?.length ? (
          history.data.map((item) => (
            <div
              key={`${item.employeeId}-${item.startDate}`}
              className="flex justify-between gap-4 border-b py-2 last:border-0"
            >
              <span>{item.curatorName}</span>
              <span>
                {dayjs(item.startDate).format('DD.MM.YYYY')} —{' '}
                {item.endDate ? dayjs(item.endDate).format('DD.MM.YYYY') : t('history.present')}
              </span>
            </div>
          ))
        ) : (
          <Paragraph className="m-0 text-sm text-neutral-500">{t('history.empty')}</Paragraph>
        )}
      </div>
    </div>
  );
};
