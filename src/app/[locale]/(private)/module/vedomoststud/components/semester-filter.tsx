'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FilterSelect } from '@/components/ui/filter-select';
import { Paragraph } from '@/components/typography/paragraph';

export function SemesterFilter({ semesters }: { semesters: number[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('private.vedomoststud.filter');
  const currentSemesterId = searchParams.get('semesterId');

  const handleSemesterSelect = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== null) {
      params.set('semesterId', value);
    } else {
      params.delete('semesterId');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-4 ml-2 flex items-center gap-4">
      <Paragraph className="text-lg font-semibold text-neutral-700">{t('semester')}</Paragraph>
      <FilterSelect
        value={currentSemesterId}
        onValueChange={handleSemesterSelect}
        options={semesters.map((semester) => ({ value: semester.toString(), label: semester }))}
        className="w-[132px]"
      />
    </div>
  );
}
