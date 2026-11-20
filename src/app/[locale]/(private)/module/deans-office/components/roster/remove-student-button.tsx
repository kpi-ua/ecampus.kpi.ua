'use client';

import { useTransition } from 'react';

import { setDeansOfficeStudentGroup } from '@/actions/deans-office.actions';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { type DeansOfficeOption } from '@/types/models/deans-office';

import { StudentGroupConfirm } from './student-group-confirm';

export function RemoveStudentButton({ student, groupId }: { student: DeansOfficeOption; groupId: number }) {
  const [pending, startTransition] = useTransition();
  const { errorToast } = useServerErrorToast();

  return (
    <StudentGroupConfirm
      action="remove"
      student={student.name}
      pending={pending}
      onConfirm={() => {
        startTransition(async () => {
          try {
            if (!(await setDeansOfficeStudentGroup(student.id, null, groupId))) {
              errorToast();
            }
          } catch {
            errorToast();
          }
        });
      }}
    />
  );
}
