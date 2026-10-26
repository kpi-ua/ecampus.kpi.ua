'use client';

import { useQuery } from '@tanstack/react-query';

import { getK7FormLecturers } from '@/actions/k7-form.actions';

export const useK7DepartmentProfiles = (departmentId?: number) =>
  useQuery({
    queryKey: ['k7-form', 'lecturers', departmentId],
    queryFn: () => getK7FormLecturers(departmentId as number),
    enabled: departmentId !== undefined,
    select: (lecturers) =>
      lecturers
        .flatMap(({ profiles, ...lecturer }) =>
          profiles
            .filter((profile) => profile.departmentId === departmentId)
            .map((profile) => ({ ...lecturer, ...profile })),
        )
        .sort(
          (first, second) =>
            first.fullName.localeCompare(second.fullName) || first.position.localeCompare(second.position),
        ),
  });
