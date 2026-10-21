'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useCuratorAssignment } from '@/app/[locale]/(private)/module/curatorlecturer/components/administration/hooks/use-curator-assignment';
import {
  CuratorAssignment,
  CuratorGroup,
  CuratorLecturer,
} from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { Heading4, Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { CuratorAssignmentHistory } from './curator-assignment-history';
import {
  createCuratorAssignmentSchema,
  getCuratorAssignmentDateBounds,
  type CuratorAssignmentFormValues,
} from './schema';

interface Props {
  academicYearStart: string;
  academicYearEnd: string;
  group: CuratorGroup;
  lecturers: CuratorLecturer[];
}

export const CuratorAssignmentPanel = ({ group, lecturers, academicYearStart, academicYearEnd }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator.administration');
  const { handleAssign, isAssigning } = useCuratorAssignment(group);
  const [editingAssignment, setEditingAssignment] = useState<CuratorAssignment | null>(null);
  const { minDate, maxDate } = getCuratorAssignmentDateBounds(academicYearStart, academicYearEnd);
  const formSchema = createCuratorAssignmentSchema(t, academicYearStart, academicYearEnd);
  const form = useForm<CuratorAssignmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { employeeId: '', startDate: '', endDate: '' },
  });
  const departmentLecturers = lecturers.filter((item) => item.department.id === group.departmentId);

  const editAssignment = (assignment: CuratorAssignment) => {
    setEditingAssignment(assignment);
    form.reset({
      employeeId: String(assignment.employeeId),
      startDate: assignment.startDate.slice(0, 10),
      endDate: assignment.endDate?.slice(0, 10) ?? '',
    });
  };

  const cancelEdit = () => {
    setEditingAssignment(null);
    form.reset({ employeeId: '', startDate: '', endDate: '' });
  };

  const onSubmit = (values: CuratorAssignmentFormValues) => {
    if (isAssigning) {
      return;
    }

    handleAssign(
      { ...values, employeeId: Number(values.employeeId), assignmentId: editingAssignment?.assignmentId },
      {
        onSuccess: (result) => {
          if (result === 'assigned') {
            cancelEdit();
          }
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-8 rounded-[24px] bg-neutral-50 p-5 sm:px-8 sm:py-6">
      <Heading4 className="m-0 text-base font-semibold">
        {t(editingAssignment ? 'edit.title' : 'assign.title')}
      </Heading4>
      <Paragraph className="m-0 text-sm text-neutral-500">{t('assign.date-range', { minDate, maxDate })}</Paragraph>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="grid gap-4 lg:grid-cols-[minmax(200px,1fr)_200px_200px_auto] lg:items-start"
        >
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem className="flex min-w-0 flex-col gap-1">
                <FormLabel className="text-sm font-normal leading-5 text-neutral-500">
                  {t(editingAssignment ? 'edit.curator' : 'assign.label')}
                </FormLabel>
                {editingAssignment ? (
                  <FormControl>
                    <Input value={editingAssignment.curatorName} readOnly className="h-9 bg-white text-sm" />
                  </FormControl>
                ) : (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isAssigning || form.formState.isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger ref={field.ref} onBlur={field.onBlur} variant="small" className="bg-white text-sm">
                        <SelectValue placeholder={t('assign.placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departmentLecturers.map((lecturer) => (
                        <SelectItem key={lecturer.employeeId} value={lecturer.employeeId.toString()}>
                          {lecturer.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex min-w-0 flex-col gap-1">
                <FormLabel className="text-sm font-normal leading-5 text-neutral-500">
                  {t('assign.start-date')}
                </FormLabel>
                <FormControl>
                  <Input
                    className="h-9 bg-white text-sm"
                    type="date"
                    min={minDate}
                    max={maxDate}
                    disabled={isAssigning}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex min-w-0 flex-col gap-1">
                <FormLabel className="text-sm font-normal leading-5 text-neutral-500">{t('assign.end-date')}</FormLabel>
                <FormControl>
                  <Input
                    className="h-9 bg-white text-sm"
                    type="date"
                    min={minDate}
                    max={maxDate}
                    disabled={isAssigning}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-2 lg:pt-6">
            <Button
              type="submit"
              variant="primary"
              size="small"
              className="h-9"
              loading={form.formState.isSubmitting || isAssigning}
            >
              {t(editingAssignment ? 'edit.submit' : 'assign.submit')}
            </Button>
            {editingAssignment && (
              <Button
                type="button"
                variant="secondary"
                size="small"
                className="h-9"
                disabled={isAssigning || form.formState.isSubmitting}
                onClick={cancelEdit}
              >
                {t('edit.cancel')}
              </Button>
            )}
          </div>
        </form>
      </Form>
      <CuratorAssignmentHistory
        groupId={group.groupId}
        onEdit={editAssignment}
        disabled={isAssigning || form.formState.isSubmitting}
      />
    </div>
  );
};
