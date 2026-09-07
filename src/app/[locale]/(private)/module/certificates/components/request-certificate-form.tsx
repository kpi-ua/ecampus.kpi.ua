'use client';

import { Heading6 } from '@/components/typography';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dash } from 'radash';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCertificateRequest } from '@/actions/certificates.actions';
import { useTranslations } from 'next-intl';

interface Props {
  certificateTypes: string[];
}

export function RequestCertificateForm({ certificateTypes }: Props) {
  const tEnums = useTranslations('global.enums.certificate-type');
  const tCert = useTranslations('private.certificate');

  const FormSchema = z.object({
    docType: z.string().trim().min(1),
    deliveryOption: z.enum(['electronic', 'paper']),
    purpose: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    includeOrderInfo: z.boolean().optional(),
  });

  type FormData = z.infer<typeof FormSchema>;

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      docType: '',
      deliveryOption: 'electronic' as const,
      purpose: '',
      notes: '',
      includeOrderInfo: false, // Default to false per KB-810 UI requirement
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    await createCertificateRequest({
      type: data.docType,
      purpose: data.purpose,
      originalRequired: data.deliveryOption === 'paper',
      notes: data.notes,
      includeOrderInfo: data.includeOrderInfo,
    });
    form.reset();
  };

  const deliveryOption = form.watch('deliveryOption');

  return (
    <Card className="rounded-b-6 col-span-full flex h-fit flex-col gap-4 bg-white p-4 sm:gap-6 sm:p-6 md:p-9 lg:w-[380px] lg:shrink-0 xl:col-span-5">
      <Heading6>{tCert('orderTitle')}</Heading6>
      <Form {...form}>
        <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(handleFormSubmit)}>
          <FormField
            control={form.control}
            name="docType"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel className="text-base" htmlFor="docType">
                  {tCert('docType')}
                </FormLabel>
                <Select onValueChange={field.onChange} {...field}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={tCert('docTypePlaceholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {certificateTypes.map((type, index) => (
                        <SelectItem key={index} value={type.toString()}>
                          {tEnums(dash(type))}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Delivery option - radio buttons */}
          <FormField
            control={form.control}
            name="deliveryOption"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel className="text-base">{tCert('deliveryOption')}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col gap-3"
                  >
                    <FormItem className="flex items-center space-y-0 space-x-3">
                      <FormControl>
                        <RadioGroupItem value="electronic" />
                      </FormControl>
                      <FormLabel className="font-normal">{tCert('deliveryElectronic')}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-y-0 space-x-3">
                      <FormControl>
                        <RadioGroupItem value="paper" />
                      </FormControl>
                      <FormLabel className="font-normal">{tCert('deliveryPaper')}</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Include order info checkbox */}
          <FormField
            control={form.control}
            name="includeOrderInfo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-y-0 space-x-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => (checked ? field.onChange(true) : field.onChange(false))}
                  />
                </FormControl>
                <FormLabel className="text-base">{tCert('includeOrderInfo')}</FormLabel>
              </FormItem>
            )}
          />

          {/* Purpose/Comment field - moved to end */}
          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel>{tCert('purpose')}</FormLabel>
                <FormControl>
                  <Textarea placeholder={tCert('purposePlaceholder')} className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notes field - shown only for paper delivery */}
          {deliveryOption === 'paper' && (
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-2">
                  <FormLabel>{tCert('notes')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={tCert('notesPlaceholder')} className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button
            type="submit"
            className="mt-3 ml-auto w-fit"
            size="big"
            disabled={!form.formState.isValid}
            loading={form.formState.isSubmitting}
          >
            {tCert('submit')}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
