'use client';

import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';

import { setDeansOfficeStudentGroup } from '@/actions/deans-office.actions';
import { Paragraph } from '@/components/typography';
import { Show } from '@/components/utils/show';
import { type DeansOfficeOption } from '@/types/models/deans-office';

import { StudentGroupConfirm } from './student-group-confirm';

export function RemoveStudentButton({ student, groupId }: { student: DeansOfficeOption; groupId: number }) {
  const t = useTranslations('private.deans-office');
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  return (
    <>
      <StudentGroupConfirm
        action="remove"
        student={student.name}
        pending={pending}
        onConfirm={() => {
          startTransition(async () => {
            setError(false);
            try {
              setError(!(await setDeansOfficeStudentGroup(student.id, null, groupId)));
            } catch {
              setError(true);
            }
          });
        }}
      />
      <Show when={error}>
        <Paragraph role="alert">{t('requestFailed')}</Paragraph>
      </Show>
    </>
  );
}
