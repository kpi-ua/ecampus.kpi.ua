import dayjs from 'dayjs';
import { getTranslations } from 'next-intl/server';

import { getContactTypes } from '@/actions/profile.actions';
import { CuratorStudentDetails } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { campusFetch } from '@/lib/client';
import { EMPTY_VALUE, PASSWORD_MASK } from '@/lib/constants/common';

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

  const response = await campusFetch<CuratorStudentDetails[]>(`/curator-lecturer/groups/${id}/students`);

  if (!response.ok) {
    return new Response(null, { status: response.status });
  }

  const students: CuratorStudentDetails[] = await response.json();
  const contactTypes = await getContactTypes();
  const t = await getTranslations('private.curatorlecturer.group-curator');
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
      const contacts = student.curatorContacts.map(
        ({ contactTypeId, value }) =>
          `${contactTypes.find((type) => type.id === contactTypeId)?.name ?? contactTypeId}: ${value}`,
      );

      return [
        student.fullName,
        student.login ?? EMPTY_VALUE,
        student.passwordChanged ? PASSWORD_MASK : student.initialPassword || EMPTY_VALUE,
        student.passwordChanged ? t('students.password-changed') : t('students.initial-password'),
        contacts.join(', ') || EMPTY_VALUE,
        student.codeOfHonorSignDate
          ? t('students.agreed', { date: dayjs(student.codeOfHonorSignDate).format('DD.MM.YYYY') })
          : t('students.not-agreed'),
      ];
    }),
  ];

  return createCsvResponse(rows, `group-${id}-${dayjs().format('YYYY-MM-DD')}.csv`);
}
