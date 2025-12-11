'use client';

import { ColleagueContact } from '@/types/models/colleague-contact';
import { ContactType } from '@/types/models/colleague-contact';
import { ColleagueCard } from './colleague-card';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import { Paragraph } from '@/components/typography';

interface ColleagueContactsListProps {
  colleagues: ColleagueContact[];
  contactTypes: ContactType[];
}

export function ColleagueContactsList({ colleagues, contactTypes }: ColleagueContactsListProps) {
  const t = useTranslations('private.directory');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubdivision, setSelectedSubdivision] = useState<string>('all');

  const allSubdivisions = useMemo(() => {
    const subdivisions = new Map<number, string>();
    colleagues.forEach((colleague) => {
      colleague.positions.forEach((position) => {
        subdivisions.set(position.subdivision.id, position.subdivision.name);
      });
    });
    return Array.from(subdivisions.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [colleagues]);

  const filteredColleagues = useMemo(() => {
    return colleagues.filter((colleague) => {
      const matchesSearch =
        searchQuery === '' ||
        colleague.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        colleague.positions.some(
          (pos) =>
            pos.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pos.subdivision.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesSubdivision =
        selectedSubdivision === 'all' ||
        colleague.positions.some((pos) => pos.subdivision.id.toString() === selectedSubdivision);

      return matchesSearch && matchesSubdivision;
    });
  }, [colleagues, searchQuery, selectedSubdivision]);

  const sortedColleagues = useMemo(() => {
    return [...filteredColleagues].sort((a, b) => a.fullName.localeCompare(b.fullName));
  }, [filteredColleagues]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder={t('search-placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Select value={selectedSubdivision} onValueChange={setSelectedSubdivision}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{t('all-subdivisions')}</SelectItem>
              {allSubdivisions.map((subdivision) => (
                <SelectItem key={subdivision.id} value={subdivision.id.toString()}>
                  {subdivision.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {filteredColleagues.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Paragraph className="text-neutral-400">{t('no-contacts-found')}</Paragraph>
        </div>
      ) : (
        <>
          <Paragraph className="text-sm text-neutral-500">
            {t('showing-count', { count: filteredColleagues.length })}
          </Paragraph>
          <div className="flex flex-col gap-4">
            {sortedColleagues.map((colleague) => (
              <ColleagueCard key={colleague.userAccountId} colleague={colleague} contactTypes={contactTypes} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
