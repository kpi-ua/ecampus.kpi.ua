import { Paragraph } from '@/components/typography/paragraph';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

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
    <div className="flex gap-2 overflow-x-auto">
      {sheetList.map((item, index) => (
        <button
          key={index}
          onClick={() => handleSheetChange(item)}
          className={`h-[77px] w-fit rounded-t-[8px] px-3 md:px-8 lg:h-[42px] ${
            selectedSheet === item ? 'bg-basic-white' : 'bg-transparent'
          }`}
        >
          <Paragraph
            className={`text-base font-semibold ${selectedSheet === item ? 'text-basic-blue' : 'text-neutral-700'}`}
          >
            {t(item)}
          </Paragraph>
        </button>
      ))}
    </div>
  );
}
