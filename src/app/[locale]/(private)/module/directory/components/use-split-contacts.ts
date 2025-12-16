'use client';

import { useMemo } from 'react';
import { sift } from 'radash';
import { Contact } from '@/types/models/colleague-contact';
import { ContactType } from '@/types/models/contact';
import { ACADEMIC_IDENTIFIER_IDS } from '@/lib/constants/contact-types';

export const useSplitContacts = (contacts: Contact[], contactTypes: ContactType[]) => {
  return useMemo(() => {
    // Process all contacts without grouping
    const processedContacts = sift(
      contacts.map((contact) => {
        const contactType = contactTypes.find((type) => type.id === contact.contactTypeId);
        if (!contactType) return null;

        // Skip empty values
        if (!contact.value || contact.value.trim() === '') return null;

        return {
          typeId: contact.contactTypeId,
          typeName: contactType.name,
          value: contact.value,
        };
      }),
    );

    // Add academic identifiers with undefined value if they don't exist
    const existingAcademicIds = new Set(processedContacts.map((c) => c.typeId));
    const missingAcademicContacts = sift(
      ACADEMIC_IDENTIFIER_IDS.filter((id) => !existingAcademicIds.has(id)).map((id) => {
        const contactType = contactTypes.find((type) => type.id === id);
        if (!contactType) return null;
        return {
          typeId: id,
          typeName: contactType.name,
        };
      }),
    );

    const allContacts = [...processedContacts, ...missingAcademicContacts];

    // Separate academic identifiers and other contacts
    const academicContacts = allContacts.filter((contact) =>
      ACADEMIC_IDENTIFIER_IDS.includes(contact.typeId as (typeof ACADEMIC_IDENTIFIER_IDS)[number]),
    );

    const otherContacts = allContacts.filter(
      (contact) => !ACADEMIC_IDENTIFIER_IDS.includes(contact.typeId as (typeof ACADEMIC_IDENTIFIER_IDS)[number]),
    );

    return { academicContacts, otherContacts };
  }, [contacts, contactTypes]);
};
