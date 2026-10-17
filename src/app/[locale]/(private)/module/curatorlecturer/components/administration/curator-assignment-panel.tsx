'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { useCuratorAssignment } from '@/app/[locale]/(private)/module/curatorlecturer/components/administration/hooks/use-curator-assignment';
import { CuratorGroup, CuratorLecturer } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { Heading4 } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { CuratorAssignmentHistory } from './curator-assignment-history';
import { createCuratorAssignmentSchema, type CuratorAssignmentFormValues } from './schema';

interface Props {
  group: CuratorGroup;
  lecturers: CuratorLecturer[];
}

export const CuratorAssignmentPanel = ({ group, lecturers }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator.administration');
  const { handleAssign, isAssigning } = useCuratorAssignment(group);
  const formSchema = createCuratorAssignmentSchema(t);
  const form = useForm<CuratorAssignmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { employeeId: '', startDate: '', endDate: '' },
  });
  const departmentLecturers = lecturers.filter((item) => item.department.id === group.departmentId);

  const onSubmit = (values: CuratorAssignmentFormValues) => {
    if (isAssigning) return;
    form.clearErrors();
    handleAssign(
      { ...values, employeeId: Number(values.employeeId) },
      {
        onSuccess: (result) => {
          if (result === 'conflict') form.setError('root', { message: t('validation.conflict') });
          if (result === 'invalid-period') form.setError('endDate', { message: t('validation.invalid-period') });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-8 rounded-[24px] bg-neutral-50 p-5 sm:px-8 sm:py-6">
      <Heading4 className="m-0 text-base font-semibold">{t('assign.title')}</Heading4>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="grid gap-4 lg:grid-cols-[minmax(200px,1fr)_200px_200px_auto] lg:items-end"
        >
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem className="flex min-w-0 flex-col gap-1">
                <FormLabel className="text-sm font-normal text-neutral-500">{t('assign.label')}</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex min-w-0 flex-col gap-1">
                <FormLabel className="text-sm font-normal text-neutral-500">{t('assign.start-date')}</FormLabel>
                <FormControl>
                  <Input className="h-9 bg-white text-sm" type="date" {...field} />
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
                <FormLabel className="text-sm font-normal text-neutral-500">{t('assign.end-date')}</FormLabel>
                <FormControl>
                  <Input className="h-9 bg-white text-sm" type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="primary"
            size="small"
            className="h-9"
            loading={isAssigning}
          >
            {t('assign.submit')}
          </Button>
          {form.formState.errors.root && (
            <p role="alert" className="text-sm text-red-600 lg:col-span-4">
              {form.formState.errors.root.message}
            </p>
          )}
        </form>
      </Form>
      <CuratorAssignmentHistory groupId={group.groupId} />
    </div>
  );
};
