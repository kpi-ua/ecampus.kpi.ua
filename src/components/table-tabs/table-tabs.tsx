'use client';

import { Paragraph } from '@/components/typography/paragraph';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';

interface Props {
  sheetList: string[];
  module: string;
}

export function TableTabs({ sheetList, module }: Props) {
  const t = useTranslations(`private.${module}.tab`);

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSheet = searchParams.get('tab') || sheetList[0];

  const handleSheetChange = (sheet: string) => {
    if (sheet === selectedSheet) {
      return;
    }
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set('tab', sheet);
    router.push(`?${currentParams.toString()}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto">
      {sheetList.map((item, index) => (
        <button
          key={index}
          onClick={() => handleSheetChange(item)}
          className={clsx(
            'h-[77px] w-fit rounded-t-[8px] px-3 hover:cursor-pointer md:px-8 lg:h-[42px]',
            selectedSheet === item ? 'bg-basic-white' : 'bg-transparent',
          )}
        >
          <Paragraph
            className={clsx('text-base font-semibold', selectedSheet === item ? 'text-basic-blue' : 'text-neutral-700')}
          >
            {t(item)}
          </Paragraph>
        </button>
      ))}
    </div>
  );
}
