'use client';

import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Group } from '@/types/models/group';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import MultipleSelector from '@/components/ui/multi-select';
import { getStudentOptions, sendMail } from '@/actions/msg.acitons';
import { useToast } from '@/hooks/use-toast';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useTranslations } from 'next-intl';
import { PaperPlaneRight } from '@/app/images';

const formSchema = z.object({
  groupIds: z.array(z.any()),
  subject: z.string().min(1),
  content: z.string().min(1),
});

export function Broadcast({ groupOptions }: { groupOptions: Group[] }) {
  const t = useTranslations('private.msg.compose');
  const { toast } = useToast();
  const { errorToast } = useServerErrorToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupIds: [],
      subject: '',
      content: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const students = await getStudentOptions(data.groupIds);
      await sendMail({
        recipients: students.map((student) => student.id),
        subject: data.subject,
        content: data.content,
      });

      toast({
        title: t('toast.success-title'),
        description: t('toast.success-description'),
      });
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
                <FormControl>
                  <MultipleSelector
                    options={groupOptions.map((group) => ({
                      value: group.id.toString(),
                      label: `${group.name} (${group.faculty})`,
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
                  <Textarea {...field} placeholder={t('form.content-placeholder')} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="medium"
              iconPosition="end"
              disabled={!form.formState.isValid}
              loading={form.formState.isSubmitting}
              icon={<PaperPlaneRight className="h-4 w-4" />}
            >
              {t('form.send')}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
