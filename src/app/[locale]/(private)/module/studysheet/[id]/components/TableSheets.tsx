import { Paragraph } from '@/components/typography/paragraph';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
interface Props {
  sheetList: string[];
  t: ReturnType<typeof useTranslations>;
}

export function TableSheets({ sheetList, t }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSheet = searchParams.get('sheet') || sheetList[0];

  const handleSheetChange = (sheet: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set('sheet', sheet);
    router.push(`?${currentParams.toString()}`);
  };

  return (
    <div className="flex gap-2">
      {sheetList.map((item, index) => (
        <button
          key={index}
          onClick={() => handleSheetChange(item)}
          className={`h-[77px] w-fit rounded-t-[8px] px-3 md:h-[42px] md:px-8 ${
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
