import { Paragraph } from '@/components/typography/paragraph';
import { useRouter, useSearchParams } from 'next/navigation';
interface Props {
  sheetList: string[];
}

export function TableSheets({ sheetList }: Props) {
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
          className={`h-[42px] w-fit rounded-t-[8px] px-[32px] ${
            selectedSheet === item ? 'bg-basic-white' : 'bg-transparent'
          }`}
        >
          <Paragraph
            className={`text-base font-semibold ${selectedSheet === item ? 'text-basic-blue' : 'text-neutral-700'}`}
          >
            {item}
          </Paragraph>
        </button>
      ))}
    </div>
  );
}
