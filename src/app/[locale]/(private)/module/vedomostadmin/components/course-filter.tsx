'use client';

import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { sessionAdministrationSearchParams } from '../search-params';

const COURSES = [
  { value: '1', label: 'courseOption', year: 1 },
  { value: '2', label: 'courseOption', year: 2 },
  { value: '3', label: 'courseOption', year: 3 },
  { value: '4', label: 'courseOption', year: 4 },
  { value: '5', label: 'mastersCourse', year: 1 },
  { value: '6', label: 'mastersCourse', year: 2 },
  { value: '7', label: 'phdCourse', year: 1 },
  { value: '8', label: 'phdCourse', year: 2 },
] as const;

export function CourseFilter() {
  const t = useTranslations('private.session-administration');
  const [course, setCourse] = useQueryState(
    'course',
    sessionAdministrationSearchParams.course.withOptions({ shallow: false, history: 'replace' }),
  );

  const handleCourseChange = (value: string) => {
    void setCourse(Number(value));
  };

  return (
    <Select value={String(course)} onValueChange={handleCourseChange}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {COURSES.map(({ value, label, year }) => (
          <SelectItem key={value} value={value}>
            {t(label, { course: year })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
