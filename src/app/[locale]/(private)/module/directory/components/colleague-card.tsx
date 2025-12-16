'use client';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ColleagueContact } from '@/types/models/colleague-contact';
import { ContactType } from '@/types/models/contact';
import { Paragraph } from '@/components/typography';
import { ContactList } from './contact-list';
import Link from 'next/link';
import { useSplitContacts } from './use-split-contacts';

interface ColleagueCardProps {
  colleague: ColleagueContact;
  contactTypes: ContactType[];
}

export function ColleagueCard({ colleague, contactTypes }: ColleagueCardProps) {
  const { academicContacts, otherContacts } = useSplitContacts(colleague.contacts, contactTypes);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="flex flex-col gap-1 md:w-[300px]">
            {colleague.intellectProfileEnabled && colleague.intellectProfile ? (
              <Link
                href={colleague.intellectProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base leading-tight"
              >
                {colleague.fullName}
              </Link>
            ) : (
              <CardTitle className="text-base font-semibold leading-tight">{colleague.fullName}</CardTitle>
            )}
            <div className="flex flex-col gap-1.5">
              {colleague.positions.map((position, index) => (
                <div key={index}>
                  {index > 0 && <div className="border-t border-neutral-200 my-1.5" />}
                  <Paragraph className="m-0 text-xs text-neutral-500">{position.name}</Paragraph>
                  <Paragraph className="m-0 text-xs text-neutral-400">{position.subdivision.name}</Paragraph>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <ContactList contacts={academicContacts} />
            <ContactList contacts={otherContacts} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
