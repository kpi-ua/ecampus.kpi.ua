import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type ChangeEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type PlanWorkplace } from '@/types/models/plans';

interface Props {
  workplaces: PlanWorkplace[];
  semester: number;
  workplaceId: number;
  search: string;
  onSemesterChange: (semester: number) => void;
  onWorkplaceChange: (workplaceId: number) => void;
  onSearchChange: (search: string) => void;
  onAddLoad: () => void;
}

export const WorkloadsFilters = ({
  workplaces,
  semester,
  workplaceId,
  search,
  onSemesterChange,
  onWorkplaceChange,
  onSearchChange,
  onAddLoad,
}: Props) => {
  const t = useTranslations('private.plans');

  const handleSemesterChange = (value: string) => onSemesterChange(Number(value));
  const handleWorkplaceChange = (value: string) => onWorkplaceChange(Number(value));
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value);

  return (
    <div className="mb-5 grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-[max-content_minmax(0,1fr)_minmax(0,1fr)_max-content]">
      <label className="grid w-fit gap-1 text-sm font-medium">
        {t('semester')}
        <Select value={String(semester)} onValueChange={handleSemesterChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">{t('allSemesters')}</SelectItem>
            <SelectItem value="1">{t('firstSemester')}</SelectItem>
            <SelectItem value="2">{t('secondSemester')}</SelectItem>
          </SelectContent>
        </Select>
      </label>
      <div>
        <label className="grid gap-1 text-sm font-medium">
          {t('workplace')}
          <Select value={String(workplaceId)} onValueChange={handleWorkplaceChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">{t('allWorkplaces')}</SelectItem>
              {workplaces.map((workplace) => (
                <SelectItem key={workplace.id} value={String(workplace.id)}>
                  {workplace.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>
      <label className="grid gap-1 text-sm font-medium">
        {t('search')}
        <Input value={search} onChange={handleSearchChange} placeholder={t('searchPlaceholder')} />
      </label>
      <Button type="button" size="small" icon={<Plus />} className="justify-self-end" onClick={onAddLoad}>
        {t('addLoad')}
      </Button>
    </div>
  );
};
