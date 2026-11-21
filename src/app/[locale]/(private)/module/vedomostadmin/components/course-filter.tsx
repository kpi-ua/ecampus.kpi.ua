'use client';

import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { sessionAdministrationSearchParams } from '../search-params';

const courses = [1, 2, 3, 4, 5, 6, 7, 8];

export function CourseFilter() {
  const t = useTranslations('private.session-administration');
  const [course, setCourse] = useQueryState(
    'course',
    sessionAdministrationSearchParams.course.withOptions({ shallow: false, history: 'replace' }),
  );

  return (
    <Select value={String(course)} onValueChange={(value) => void setCourse(Number(value))}>
      <SelectTrigger className="w-full sm:max-w-xs" aria-label={t('course')}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {courses.map((value) => (
          <SelectItem key={value} value={String(value)}>
            {value < 7 ? t('courseOption', { course: value }) : t('phdCourse', { course: value - 6 })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
