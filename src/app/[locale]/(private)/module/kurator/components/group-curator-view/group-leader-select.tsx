'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { assignGroupLeader, getCuratorStudents } from '@/actions/curator.actions';
import { Paragraph } from '@/components/typography';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useToast } from '@/hooks/use-toast';

import { CuratorGroup } from '../../types';
import { CURATOR_GROUP_STALE_TIME, curatorGroupQueryKeys } from './query-keys';

interface Props {
  group: CuratorGroup;
}

export const GroupLeaderSelect = ({ group }: Props) => {
  const t = useTranslations('private.curator.lecturer.group-curator');
  const { toast } = useToast();
  const { errorToast } = useServerErrorToast();
  const [studentId, setStudentId] = useState(group.groupLeaderStudentId?.toString() ?? '');
  const studentsQuery = useQuery({
    queryKey: curatorGroupQueryKeys.students(group.groupId),
    queryFn: () => getCuratorStudents(group.groupId),
    staleTime: CURATOR_GROUP_STALE_TIME,
  });
  const assignment = useMutation({
    mutationFn: (nextStudentId: number) => assignGroupLeader(group.groupId, nextStudentId),
    onSuccess: (_, nextStudentId) => {
      setStudentId(nextStudentId.toString());
      toast({ title: t('leader.success-title'), description: t('leader.success-description') });
    },
    onError: () => errorToast(),
  });

  useEffect(() => {
    setStudentId(group.groupLeaderStudentId?.toString() ?? '');
  }, [group.groupId, group.groupLeaderStudentId]);

  const isLoading = studentsQuery.isLoading || assignment.isPending;

  return (
    <div className="border-neutral-divider min-w-64 border-r px-5 last:border-r-0">
      <Select value={studentId} onValueChange={(value) => assignment.mutate(Number(value))} disabled={isLoading}>
        <SelectTrigger variant="small" aria-label={t('leader.select')}>
          {isLoading ? (
            <LoaderCircle className="size-4 animate-spin" aria-label={t('leader.loading')} />
          ) : (
            <SelectValue placeholder={t('not-assigned')} />
          )}
        </SelectTrigger>
        <SelectContent>
          {studentsQuery.data?.map((student) => (
            <SelectItem key={student.studentId} value={student.studentId.toString()}>
              {student.fullName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Paragraph className="m-0 mt-1 text-sm text-neutral-500">{t('facts.group-leader')}</Paragraph>
    </div>
  );
};
