'use client';

import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';

import { searchDeansOfficeStudents, setDeansOfficeStudentGroup } from '@/actions/deans-office.actions';
import { Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Show } from '@/components/utils/show';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { type DeansOfficeStudentSearchResult } from '@/types/models/deans-office';

import { StudentGroupConfirm } from './student-group-confirm';

export function StudentGroupActions({ facultyId, groupId }: { facultyId: number | null; groupId: number }) {
  const t = useTranslations('private.deans-office');
  const [search, setSearch] = useState('');
  const [matches, setMatches] = useState<DeansOfficeStudentSearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [pending, startTransition] = useTransition();
  const { errorToast } = useServerErrorToast();

  return (
    <div className="space-y-3">
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(async () => {
            try {
              setMatches(await searchDeansOfficeStudents(facultyId, search.trim()));
              setSearched(true);
            } catch {
              setMatches([]);
              setSearched(false);
              errorToast();
            }
          });
        }}
      >
        <Input
          className="max-w-sm"
          aria-label={t('searchStudent')}
          placeholder={t('searchStudent')}
          value={search}
          maxLength={100}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Button loading={pending} disabled={search.trim().length < 2}>
          {t('search')}
        </Button>
      </form>
      <Show when={searched && !matches.length}>
        <Paragraph>{t('empty')}</Paragraph>
      </Show>
      {matches.map((student) => (
        <div key={student.id} className="flex items-center gap-3">
          <span>{student.name}</span>
          <StudentGroupConfirm
            action="assign"
            student={student.name}
            pending={pending}
            onConfirm={() => {
              startTransition(async () => {
                try {
                  if (await setDeansOfficeStudentGroup(student.id, groupId, student.groupId)) {
                    setMatches([]);
                    setSearched(false);
                    setSearch('');
                  } else {
                    errorToast();
                  }
                } catch {
                  errorToast();
                }
              });
            }}
          />
        </div>
      ))}
    </div>
  );
}
