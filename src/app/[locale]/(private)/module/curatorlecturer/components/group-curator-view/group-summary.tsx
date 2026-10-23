'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { getCuratorStudents } from '@/actions/curatorlecturer.actions';
import {
  CURATOR_GROUP_STALE_TIME,
  curatorGroupQueryKeys,
} from '@/app/[locale]/(private)/module/curatorlecturer/components/group-curator-view/shared/query-keys';
import { Paragraph } from '@/components/typography';
import { EMPTY_VALUE } from '@/lib/constants/common';

import { CuratorGroup } from '../../types';

interface Props {
  group: CuratorGroup;
}

export const GroupSummary = ({ group }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator');
  const { data: students = [], isFetching } = useQuery({
    queryKey: curatorGroupQueryKeys.students(group.groupId),
    queryFn: () => getCuratorStudents(group.groupId),
    staleTime: CURATOR_GROUP_STALE_TIME,
  });
  const facts = [
    { label: t('facts.study-form'), value: group.studyForm },
    { label: t('facts.speciality'), value: group.speciality },
    { label: t('facts.course'), value: group.course.toString() },
    { label: t('facts.department'), value: group.departmentAbbreviation || group.departmentName },
    { label: t('facts.count-label'), value: isFetching ? EMPTY_VALUE : students.length.toString() },
    { label: t('facts.group-leader'), value: group.groupLeaderName || t('not-assigned') },
  ];

  return (
    <div className="flex flex-wrap gap-y-5">
      {facts.map(({ label, value }) => (
        <div key={label} className="min-w-36 border-r border-neutral-divider px-5 first:pl-2 last:border-r-0">
          <Paragraph className="m-0 text-sm font-semibold text-neutral-900">{value || EMPTY_VALUE}</Paragraph>
          <Paragraph className="m-0 mt-1 text-sm text-neutral-500">{label}</Paragraph>
        </div>
      ))}
    </div>
  );
};
