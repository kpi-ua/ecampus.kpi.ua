'use client';

import { useTranslations } from 'next-intl';
import { useTransition } from 'react';

import { setDeansOfficeStudentGroup } from '@/actions/deans-office.actions';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useToast } from '@/hooks/use-toast';
import { type DeansOfficeOption } from '@/types/models/deans-office';

import { StudentGroupConfirm } from './student-group-confirm';

export function RemoveStudentButton({ student, group }: { student: DeansOfficeOption; group: DeansOfficeOption }) {
  const t = useTranslations('private.deans-office');
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const { errorToast } = useServerErrorToast();

  const handleRemove = () => {
    startTransition(async () => {
      try {
        if (!(await setDeansOfficeStudentGroup(student.id, null, group.id))) {
          errorToast();
          return;
        }

        toast({ title: t('studentRemoved', { student: student.name, group: group.name }) });
      } catch {
        errorToast();
      }
    });
  };

  return <StudentGroupConfirm action="remove" student={student.name} pending={pending} onConfirm={handleRemove} />;
}
