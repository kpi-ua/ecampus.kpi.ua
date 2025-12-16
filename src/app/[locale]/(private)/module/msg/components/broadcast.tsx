'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import MultipleSelector from '@/components/ui/multi-select';
import { getStudentOptions, sendMail } from '@/actions/msg.actions';
import { useToast } from '@/hooks/use-toast';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { EntityIdName } from '@/types/models/entity-id-name';
import { useTranslations } from 'next-intl';
import { Option, optionSchema } from '../types';

export function Broadcast({ groupOptions }: { groupOptions: EntityIdName[] }) {
  const { toast } = useToast();
  const { errorToast } = useServerErrorToast();
  const t = useTranslations('private.msg.compose');

  const formSchema = z.object({
    groupIds: z.array(optionSchema).min(1, { message: t('validation.group-required') }),
    subject: z.string().min(1, { message: t('validation.subject-required') }),
    content: z.string().min(1, { message: t('validation.content-required') }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      groupIds: [] as Option[],
      subject: '',
      content: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const groupIds = data.groupIds.map((option) => Number(option.value));
      const students = await getStudentOptions(groupIds);
      await sendMail({
        recipients: students.map((student) => student.id),
        subject: data.subject,
        content: data.content,
      });

      toast({
        title: t('toast.success-title'),
        description: t('toast.success-description'),
      });
      form.reset();
    } catch (error) {
      errorToast();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="groupIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.study-group')}</FormLabel>
                <MultipleSelector
                  value={field.value}
                  options={groupOptions.map((group) => ({
                    value: group.id.toString(),
                    label: group.name,
                  }))}
                  onChange={field.onChange}
                />
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
                  <Textarea {...field} placeholder={t('form.content-placeholder')} />
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
        </div>
      </form>
    </Form>
  );
}
