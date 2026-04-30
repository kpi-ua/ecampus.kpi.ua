'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  SbpLoadCatalogItem,
  SbpStudyYearCatalogItem,
  SbpSubdivisionCatalogItem,
} from '@/types/models/sbp-rights';
import { GrantRightsDialog } from './grant-rights-dialog';

interface Props {
  loads: SbpLoadCatalogItem[];
  subdivisions: SbpSubdivisionCatalogItem[];
  years: SbpStudyYearCatalogItem[];
}

/**
 * Header button that opens the Grant Rights dialog. Holds the open state
 * locally so the page (a server component) doesn't need to.
 */
export function GrantButton({ loads, subdivisions, years }: Props) {
  const t = useTranslations('private.studbonuspointsrights.grant');
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        {t('button')}
      </Button>
      <GrantRightsDialog
        open={open}
        onOpenChange={setOpen}
        loads={loads}
        subdivisions={subdivisions}
        years={years}
      />
    </>
  );
}
