'use client';

import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';

import { setDekanatStudentGroup } from '@/actions/dekanat.actions';
import { Paragraph } from '@/components/typography';
import { Show } from '@/components/utils/show';
import { type DekanatOption } from '@/types/models/dekanat';

import { StudentGroupConfirm } from './student-group-confirm';

export function RemoveStudentButton({ student, groupId }: { student: DekanatOption; groupId: number }) {
  const t = useTranslations('private.ekanat');
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
              setError(!(await setDekanatStudentGroup(student.id, null, groupId)));
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
