'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Paragraph } from '@/components/typography/paragraph';

export function SemesterFilter({ semesters }: { semesters: number[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('private.vedomoststud.filter');
  const currentSemesterId = searchParams.get('semesterId') || '';

  const handleSemesterSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set('semesterId', value);
    } else {
      params.delete('semesterId');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-4 ml-2 flex items-center gap-4">
      <Paragraph className="text-lg font-semibold text-neutral-700">{t('semester')}</Paragraph>
      <Select value={currentSemesterId || 'all'} onValueChange={handleSemesterSelect}>
        <SelectTrigger className="h-[36px] w-[132px]">
          <SelectValue placeholder={t('select-semester')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">{t('all')}</SelectItem>
            {semesters.map((semester) => (
              <SelectItem key={semester} value={semester.toString()}>
                {semester}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
