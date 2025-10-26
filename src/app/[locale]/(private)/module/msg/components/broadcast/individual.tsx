'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Send } from 'lucide-react';
import { Subdivision } from '../compose';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import MultipleSelector from '@/components/ui/multi-select';
import { getEmployeeOptions, getGroupOptions, getStudentOptions, sendMail } from '@/actions/msg.acitons';
import { useToast } from '@/hooks/use-toast';


export function Individual({ facultyOptions }: { facultyOptions: Subdivision[] }) {
  const [recipientType, setRecipientType] = useState<'employee' | 'student'>('employee');
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
      title: 'Повідомлення відправлено',
      description: 'Повідомлення відправлено успішно',
    });
  };

  const selectedFacultyIds = form.watch('facultyIds');

  useEffect(() => {
    if (!selectedFacultyIds.length) {
      setUserOptions([]);
      setGroupOptions([]);
      return;
    }

    if (recipientType === 'employee') {
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
            defaultValue="employee"
            onValueChange={(value) => setRecipientType(value as 'employee' | 'student')}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="employee" id="r1" />
              <Label htmlFor="r1">Співробітник</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="student" id="r2" />
              <Label htmlFor="r2">Студент</Label>
            </div>
          </RadioGroup>
        </div>
        <FormField
          control={form.control}
          name="facultyIds"
          render={({ field }) => (
            <FormItem>
              <Label>Підрозділ</Label>
              <MultipleSelector
                options={facultyOptions.map((faculty) => ({
                  value: faculty.id.toString(),
                  label: faculty.name,
                }))}
                onChange={(options) => field.onChange(options.map((option) => Number(option.value)))}
              />
            </FormItem>
          )}
        />
        {recipientType === 'student' && (
          <FormField
            control={form.control}
            name="groupIds"
            render={({ field }) => (
              <FormItem>
                <Label>Навчальна група</Label>
                <MultipleSelector
                  options={groupOptions.map((group) => ({
                    value: group.id.toString(),
                    label: group.name,
                  }))}
                  onChange={(options) => field.onChange(options.map((option) => Number(option.value)))}
                />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="userIds"
          render={({ field }) => (
            <FormItem>
              <Label>ПІБ одержувача</Label>
              <MultipleSelector
                options={userOptions.map((user) => ({
                  value: user.id.toString(),
                  label: user.name,
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
              <Label>
                Тема повідомлення <span className="text-destructive">*</span>
              </Label>
              <Input {...field} placeholder="Тема повідомлення" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <Label>
                Текст повідомлення <span className="text-destructive">*</span>
              </Label>
              <Textarea {...field} placeholder="Текст повідомлення" maxLength={1000} />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="medium" icon={<Send className="h-4 w-4" />}>
            Відправити
          </Button>
        </div>
      </form>
    </Form>
  );
}
