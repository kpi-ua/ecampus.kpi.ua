'use client';

import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

import { Paragraph } from '@/components/typography';

import { PeriodFormValues } from './schema';
import { appealRange } from './utils';

const formatShort = (date: string | dayjs.Dayjs) => dayjs(date).format('DD.MM');

/** «Подача: 30.11–08.12 · Перевірка: 01.12–10.12 · Апеляція: 11.12–21.12 · Експорт з 22.12», once the dates are set. */
export const PeriodSummary = ({ values }: { values: Partial<PeriodFormValues> }) => {
  const t = useTranslations('private.studbonuspointsrights.periods.form');
  const { studentDateStart, studentDateEnd, operatorDateStart, operatorDateEnd, dateExport } = values;

  if (!studentDateStart || !studentDateEnd || !operatorDateStart || !operatorDateEnd || !dateExport) {
    return null;
  }

  const appeal = appealRange(operatorDateEnd, dateExport);
  const parts = [
    t('summary.submission', { from: formatShort(studentDateStart), to: formatShort(studentDateEnd) }),
    t('summary.review', { from: formatShort(operatorDateStart), to: formatShort(operatorDateEnd) }),
    appeal ? t('summary.appeal', { from: formatShort(appeal.from), to: formatShort(appeal.to) }) : null,
    t('summary.export', { date: formatShort(dateExport) }),
  ].filter(Boolean);
  const hasNoAppeal = !appeal && dateExport > operatorDateEnd;

  return (
    <div className="flex flex-col gap-1">
      <Paragraph className="my-0 text-sm text-neutral-700">{parts.join(' · ')}</Paragraph>
      {hasNoAppeal && <Paragraph className="my-0 text-sm text-other-orange">{t('noAppealWarning')}</Paragraph>}
    </div>
  );
};
