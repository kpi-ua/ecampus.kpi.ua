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

  const handleCourseChange = (value: string) => {
    void setCourse(Number(value));
  };

  const getCourseLabel = (value: number) => {
    if (value <= 4) {
      return t('courseOption', { course: value });
    }
    if (value <= 6) {
      return t('mastersCourse', { course: value - 4 });
    }
    return t('phdCourse', { course: value - 6 });
  };

  return (
    <Select value={String(course)} onValueChange={handleCourseChange}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {courses.map((value) => (
          <SelectItem key={value} value={String(value)}>
            {getCourseLabel(value)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
