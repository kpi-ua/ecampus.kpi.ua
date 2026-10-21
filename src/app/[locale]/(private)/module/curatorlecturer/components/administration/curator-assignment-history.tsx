'use client';

import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { getCuratorAssignments } from '@/actions/curatorlecturer.actions';
import { Heading4, Paragraph } from '@/components/typography';
import { Show } from '@/components/utils/show';
import { formatDate } from '@/lib/utils';

import { curatorAdministrationQueryKeys } from './query-keys';

interface Props {
  groupId: number;
}

export const CuratorAssignmentHistory = ({ groupId }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator.administration');
  const { data: assignments = [], isFetching } = useQuery({
    queryKey: curatorAdministrationQueryKeys.assignments(groupId),
    queryFn: () => getCuratorAssignments(groupId),
  });

  return (
    <div className="flex flex-col gap-2">
      <Heading4 className="m-0 mb-1 text-base font-semibold">{t('history.title')}</Heading4>
      <Show when={!isFetching} fallback={<LoaderCircle className="size-5 animate-spin" />}>
        <Show
          when={assignments.length > 0}
          fallback={<Paragraph className="m-0 text-sm text-neutral-500">{t('history.empty')}</Paragraph>}
        >
          {assignments.map((item) => (
            <div
              key={`${item.employeeId}-${item.startDate}`}
              className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-neutral-200 py-3 text-sm last:border-0"
            >
              <span>{item.curatorName}</span>
              <span>
                {formatDate(item.startDate)} — {item.endDate ? formatDate(item.endDate) : t('history.present')}
              </span>
            </div>
          ))}
        </Show>
      </Show>
    </div>
  );
};
