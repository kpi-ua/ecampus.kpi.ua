import dayjs from 'dayjs';
import { getTranslations } from 'next-intl/server';

import { CuratorStudentCredentials } from '@/app/[locale]/(private)/module/kurator/types';
import { campusFetch } from '@/lib/client';
import { createCsvResponse } from '@/lib/csv-response';

interface Props {
  params: Promise<{ groupId: string }>;
}

export async function GET(_request: Request, { params }: Props) {
  const { groupId } = await params;
  const id = Number(groupId);

  if (!Number.isInteger(id) || id < 1) {
    return new Response(null, { status: 400 });
  }

  const response = await campusFetch<CuratorStudentCredentials[]>(
    `/curator-lecturer/groups/${id}/students/credentials`,
  );

  if (!response.ok) {
    return new Response(null, { status: response.status });
  }

  const students = await response.json();
  const t = await getTranslations('private.curator.lecturer.group-curator');
  const rows = [
    [
      t('students.name'),
      t('students.login'),
      t('students.password'),
      t('students.status'),
      t('students.contacts'),
      t('students.code-of-honor'),
    ],
    ...students.map((student) => {
      const contacts = Array.from(
        new Map(
          [student.email, ...student.curatorContacts]
            .filter((value): value is string => Boolean(value?.trim()))
            .map((value) => [value.trim().toLocaleLowerCase(), value.trim()]),
        ).values(),
      );

      return [
        student.fullName,
        student.login ?? '—',
        student.passwordChanged ? '••••••••' : student.initialPassword || '—',
        student.passwordChanged ? t('students.password-changed') : t('students.initial-password'),
        contacts.join(', ') || '—',
        student.codeOfHonorSignDate
          ? t('students.agreed', { date: dayjs(student.codeOfHonorSignDate).format('DD.MM.YYYY') })
          : t('students.not-agreed'),
      ];
    }),
  ];

  return createCsvResponse(rows, `group-${id}-${dayjs().format('YYYY-MM-DD')}.csv`);
}
