'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

import { Books, CaretUpRegular } from '@/app/images';
import { cn, formatNumber } from '@/lib/utils';

interface Props {
  number: string;
  title: string;
  hours: number;
  summaryText?: string;
  children: ReactNode;
}

export const ReportSection = ({ number, title, hours, summaryText, children }: Props) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="border-neutral-divider min-w-0 overflow-hidden rounded-[6px] border bg-white">
      <div className="border-neutral-divider flex min-h-[40px] items-center gap-3 border-b px-4 py-[11px]">
        <Books className="text-basic-blue size-[16px] shrink-0" />
        <span className="min-w-0 text-[12px] leading-[16px] font-semibold text-neutral-900">
          Розділ {number}. — {title}
        </span>
        <span className="ml-auto shrink-0 pl-2 text-[12px] leading-[16px] font-semibold text-neutral-900">
          {summaryText ?? `${formatNumber(hours, 0)} год.`}
        </span>
        <button
          className="flex size-[24px] shrink-0 cursor-pointer items-center justify-center rounded-[4px] text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
          type="button"
          onClick={() => setExpanded((current) => !current)}
        >
          <CaretUpRegular className={cn('size-[16px] transition-transform', !expanded && 'rotate-180')} />
        </button>
      </div>
      {expanded && children}
    </section>
  );
};
