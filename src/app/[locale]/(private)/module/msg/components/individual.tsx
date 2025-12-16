'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect, useCallback } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import MultipleSelector from '@/components/ui/multi-select';
import { getEmployeeOptions, getStudentOptions, sendMail } from '@/actions/msg.actions';
import { useToast } from '@/hooks/use-toast';
import { EntityIdName } from '@/types/models/entity-id-name';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

interface Props {
  groupOptions: EntityIdName[];
}

export function Individual({ groupOptions }: Props) {
  const [recipientType, setRecipientType] = useState<'employee' | 'student'>('employee');
  const [userOptions, setUserOptions] = useState<EntityIdName[]>([]);
  const [formKey, setFormKey] = useState(0);

  const { toast } = useToast();
  const { errorToast } = useServerErrorToast();
  const t = useTranslations('private.msg.compose');

  const formSchema = z.object({
    groupIds: z.array(z.number()),
    userIds: z.array(z.number()).min(1, { message: t('validation.user-required') }),
    subject: z.string().min(1, { message: t('validation.subject-required') }),
    content: z.string().min(1, { message: t('validation.content-required') }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      groupIds: [],
      userIds: [],
      subject: '',
      content: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
    await sendMail({
      recipients: data.userIds,
        subject: data.subject,
        content: data.content,
      });
      toast({
        title: t('toast.success-title'),
        description: t('toast.success-description'),
      });
      form.reset();
      setUserOptions([]);
      setFormKey((prev) => prev + 1);
    } catch (error) {
      errorToast();
    }
  };

  const selectedGroupIds = form.watch('groupIds');

  useEffect(() => {
    form.setValue('userIds', []);
  }, [recipientType, form]);

  useEffect(() => {
    if (recipientType === 'student' && selectedGroupIds.length > 0) {
      getStudentOptions(selectedGroupIds).then((students) => {
        setUserOptions(students);
      });
    } else if (recipientType === 'student') {
      setUserOptions([]);
    }
  }, [selectedGroupIds, recipientType]);

  const handleEmployeeSearch = useCallback(async (value: string) => {
    if (value.length < 5) {
      return [];
    }
    const employees = await getEmployeeOptions(value);
    return employees.map((employee) => ({
      value: employee.id.toString(),
      label: employee.name,
    }));
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 space-y-8">
        <div className="flex gap-6">
          <RadioGroup
            className="flex"
            defaultValue="employee"
            onValueChange={(value) => setRecipientType(value as 'employee' | 'student')}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="employee" id="r1" />
              <Label htmlFor="r1">{t('recipient-type.employee')}</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="student" id="r2" />
              <Label htmlFor="r2">{t('recipient-type.student')}</Label>
            </div>
          </RadioGroup>
        </div>
        {recipientType === 'student' && (
          <FormField
            control={form.control}
            name="groupIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.study-group')}</FormLabel>
                <MultipleSelector
                  key={`group-selector-${formKey}`}
                  options={groupOptions.map((group) => ({
                    value: group.id.toString(),
                    label: group.name,
                  }))}
                  onChange={(options) => field.onChange(options.map((option) => Number(option.value)))}
                />
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
              {recipientType === 'employee' ? (
                <MultipleSelector
                  key={`employee-selector-${formKey}`}
                  onChange={(options) => field.onChange(options.map((option) => Number(option.value)))}
                  onSearch={handleEmployeeSearch}
                  placeholder={t('form.search-placeholder')}
                  emptyIndicator={t('form.search-empty')}
                  triggerSearchOnFocus={false}
                />
              ) : (
                <MultipleSelector
                  key={`student-selector-${formKey}`}
                  options={userOptions.map((user) => ({
                    value: user.id.toString(),
                    label: user.name,
                  }))}
                  onChange={(options) => field.onChange(options.map((option) => Number(option.value)))}
                  placeholder={t('form.select-recipient-placeholder')}
                  emptyIndicator={t('form.select-group-first')}
                />
              )}
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
          <Button type="submit" variant="primary" size="medium" icon={<Send className="h-4 w-4" />}>
            {t('form.send')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
