'use client';

import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Group } from '@/types/models/group';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import MultipleSelector from '@/components/ui/multi-select';
import { getStudentOptions, sendMail } from '@/actions/msg.acitons';
import { useToast } from '@/hooks/use-toast';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

const formSchema = z.object({
  groupIds: z.array(z.any()),
  subject: z.string().min(1),
  content: z.string().min(1),
});

export function Broadcast({ groupOptions }: { groupOptions: Group[] }) {
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
        title: 'Повідомлення відправлено',
        description: 'Повідомлення відправлено успішно',
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
                <FormLabel>Навчальна група</FormLabel>
                <MultipleSelector
                  options={groupOptions.map((group) => ({
                    value: group.id.toString(),
                    label: `${group.name} (${group.faculty})`,
                  }))}
                  onChange={(options) => field.onChange(options.map((option) => Number(option.value)))}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тема повідомлення</FormLabel>
                <Input {...field} placeholder="Тема повідомлення" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Текст повідомлення</FormLabel>
                <Textarea {...field} placeholder="Текст повідомлення" />
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="medium" icon={<Send className="h-4 w-4" />}>
              Відправити
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
