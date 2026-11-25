'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { getPlanResponsibilities, setPlanResponsible } from '@/actions/plans.actions';
import { Paragraph } from '@/components/typography';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const ResponsibilitiesTab = () => {
  const t = useTranslations('private.plans');
  const [semester, setSemester] = useState(0);
  const [search, setSearch] = useState('');
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ['plans', 'responsibilities', semester],
    queryFn: () => getPlanResponsibilities(semester),
  });
  const mutation = useMutation({
    mutationFn: async (action: () => Promise<{ ok: boolean }>) => {
      const result = await action();
      if (!result.ok) {
        throw new Error(t('requestError'));
      }
    },
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ['plans'] });
    },
  });
  const busy = mutation.isPending;
  const run = (action: () => Promise<{ ok: boolean }>, _success: string) => mutation.mutate(action);
  const filteredResponsibilities = (query.data ?? []).filter((item) =>
    `${item.curriculumRow} ${item.group} ${item.teachers.map((teacher) => teacher.name).join(' ')}`
      .toLocaleLowerCase()
      .includes(search.trim().toLocaleLowerCase()),
  );
  return (
    <div>
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="grid gap-1 text-sm font-medium">
          {t('semester')}
          <Select value={String(semester)} onValueChange={(value) => setSemester(Number(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">{t('allSemesters')}</SelectItem>
              <SelectItem value="1">{t('firstSemester')}</SelectItem>
              <SelectItem value="2">{t('secondSemester')}</SelectItem>
            </SelectContent>
          </Select>
        </label>
        <label className="grid gap-1 text-sm font-medium">
          {t('search')}
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('searchPlaceholder')}
          />
        </label>
      </div>
      {query.isFetching && <Paragraph role="status">{t('loading')}</Paragraph>}
      {(query.isError || mutation.isError) && (
        <Paragraph className="text-red-700" role="alert">
          {t('requestError')}
        </Paragraph>
      )}
      {mutation.isSuccess && (
        <Paragraph className="text-green-700" role="status">
          {t('saved')}
        </Paragraph>
      )}{' '}
      <div>
        {filteredResponsibilities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-14 text-center">
            <Paragraph className="my-0 text-sm text-neutral-600">{t('emptyResponsibilities')}</Paragraph>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('curriculumRow')}</TableHead>
                <TableHead>{t('groups')}</TableHead>
                <TableHead>{t('semester')}</TableHead>
                <TableHead>{t('responsibleTeacher')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResponsibilities.map((item) => (
                <TableRow key={`${item.curriculumRowId}-${item.semester}-${item.groupId}`}>
                  <TableCell className="min-w-56 font-medium">{item.curriculumRow}</TableCell>
                  <TableCell>{item.group}</TableCell>
                  <TableCell>{item.semester === 1 ? t('firstSemester') : t('secondSemester')}</TableCell>
                  <TableCell className="min-w-52">
                    {item.teachers.length === 1 ? (
                      item.teachers[0].name
                    ) : (
                      <Select
                        value={item.teachers.find((teacher) => teacher.isResponsible)?.employeeId.toString()}
                        disabled={busy}
                        onValueChange={(value) =>
                          run(
                            () => setPlanResponsible(item.curriculumRowId, item.semester, item.groupId, Number(value)),
                            t('saved'),
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('chooseTeacher')} />
                        </SelectTrigger>
                        <SelectContent>
                          {item.teachers.map((teacher) => (
                            <SelectItem key={teacher.employeeId} value={String(teacher.employeeId)}>
                              {teacher.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};
