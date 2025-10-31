'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import MultipleSelector from '@/components/ui/multi-select';
import { getEmployeeOptions, getGroupOptions, getStudentOptions, sendMail } from '@/actions/msg.acitons';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { PaperPlaneRight } from '@/app/images';
import { Subdivision } from '@/types/models/subdivision';

enum RecipientType {
  Employee = 'employee',
  Student = 'student',
}

export function Individual({ facultyOptions }: { facultyOptions: Subdivision[] }) {
  const t = useTranslations('private.msg.compose');
  const [recipientType, setRecipientType] = useState<RecipientType>(RecipientType.Employee);
  const [groupOptions, setGroupOptions] = useState<{ id: number; name: string }[]>([]);

  const { toast } = useToast();
  const [userOptions, setUserOptions] = useState<{ id: number; name: string }[]>([]);
  const formSchema = z.object({
    facultyIds: z.array(z.number()),
    groupIds: z.array(z.number()),
    userIds: z.array(z.number()),
    subject: z.string().min(1),
    content: z.string().min(1),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facultyIds: [],
      groupIds: [],
      userIds: [],
      subject: '',
      content: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await sendMail({
      recipients: data.userIds,
      subject: data.subject,
      content: data.content,
    });
    toast({
      title: t('toast.success-title'),
      description: t('toast.success-description'),
    });
  };

  const selectedFacultyIds = form.watch('facultyIds');

  useEffect(() => {
    if (!selectedFacultyIds.length) {
      setUserOptions([]);
      setGroupOptions([]);
      return;
    }

    if (recipientType === RecipientType.Employee) {
      getEmployeeOptions(selectedFacultyIds).then((employees) => {
        setUserOptions(employees);
      });
    }
    getGroupOptions(selectedFacultyIds).then((groups) => {
      setGroupOptions(groups);
    });
  }, [recipientType, selectedFacultyIds]);

  const selectedGroupIds = form.watch('groupIds');

  useEffect(() => {
    if (!selectedGroupIds.length) {
      setUserOptions([]);
      return;
    }
    getStudentOptions(selectedGroupIds).then((students) => {
      setUserOptions(students);
    });
  }, [selectedGroupIds]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 space-y-8">
        <div className="flex gap-6">
          <RadioGroup
            className="flex"
            defaultValue={RecipientType.Employee}
            onValueChange={(value) => setRecipientType(value as RecipientType)}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value={RecipientType.Employee} id="r1" />
              <Label htmlFor="r1">{t('recipient-type.employee')}</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value={RecipientType.Student} id="r2" />
              <Label htmlFor="r2">{t('recipient-type.student')}</Label>
            </div>
          </RadioGroup>
        </div>
        <FormField
          control={form.control}
          name="facultyIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.subdivision')}</FormLabel>
              <FormControl>
                <MultipleSelector
                  options={facultyOptions.map((faculty) => ({
                    value: faculty.id.toString(),
                    label: faculty.name,
                  }))}
                  onChange={(options) => field.onChange(options.map((option) => Number(option.value)))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {recipientType === RecipientType.Student && (
          <FormField
            control={form.control}
            name="groupIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.study-group')}</FormLabel>
                <FormControl>
                  <MultipleSelector
                    options={groupOptions.map((group) => ({
                      value: group.id.toString(),
                      label: group.name,
                    }))}
                    onChange={(options) => field.onChange(options.map((option) => Number(option.value)))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="userIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.recipient-name')}</FormLabel>
              <FormControl>
                <MultipleSelector
                  options={userOptions.map((user) => ({
                    value: user.id.toString(),
                    label: user.name,
                  }))}
                  onChange={(options) => field.onChange(options.map((option) => Number(option.value)))}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.subject')}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t('form.subject-placeholder')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.content')}</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder={t('form.content-placeholder')} maxLength={1000} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={!form.formState.isValid}
            loading={form.formState.isSubmitting}
            size="medium"
            iconPosition="end"
            icon={<PaperPlaneRight className="h-4 w-4 text-white" />}
          >
            {t('form.send')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
