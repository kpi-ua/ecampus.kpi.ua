import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';
import { EMPTY_VALUE } from '@/lib/constants/common';

import { CuratorGroup } from '../../types';

interface Props {
  group: CuratorGroup;
}

export const GroupSummary = ({ group }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator');
  const facts = [
    { label: t('facts.study-form'), value: group.studyForm },
    { label: t('facts.speciality'), value: group.speciality },
    { label: t('facts.course'), value: group.course.toString() },
    { label: t('facts.department'), value: group.departmentAbbreviation || group.departmentName },
    { label: t('facts.group-leader'), value: group.groupLeaderName || t('not-assigned') },
  ];

  return (
    <div className="flex flex-wrap gap-y-5">
      {facts.map(({ label, value }) => (
        <div key={label} className="border-neutral-divider min-w-36 border-r px-5 first:pl-2 last:border-r-0">
          <Paragraph className="m-0 text-sm font-semibold text-neutral-900">{value || EMPTY_VALUE}</Paragraph>
          <Paragraph className="m-0 mt-1 text-sm text-neutral-500">{label}</Paragraph>
        </div>
      ))}
    </div>
  );
};
