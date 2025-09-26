'use client';

import { Paragraph } from '@/components/typography/paragraph';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';

interface Props {
  sheetList: string[];
}

export function TableSheets({ sheetList }: Props) {
  const t = useTranslations('private.study-sheet.sheet');

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSheet = searchParams.get('sheet') || sheetList[0];

  const handleSheetChange = (sheet: string) => {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set('sheet', sheet);
    router.push(`?${currentParams.toString()}`);
  };

  return (
    <div className="flex gap-2">
      {sheetList.map((item, index) => (
        <button
          key={index}
          onClick={() => handleSheetChange(item)}
          className={clsx(
            'w-fit cursor-pointer rounded-t-[8px] px-3 md:px-8',
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
