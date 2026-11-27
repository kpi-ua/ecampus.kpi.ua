'use client';

import { ChevronDown, ChevronRight, Trash2, UserX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment, useState } from 'react';

import { revokeAllSbpRightsForUser } from '@/actions/sbp-rights.actions';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DATE_FORMAT, EMPTY_VALUE } from '@/lib/constants/common';
import { formatDate } from '@/lib/utils';
import { SbpRightsHolder } from '@/types/models/sbp-rights';

import { useUserRights } from '../hooks/use-user-rights';
import { RevokeDialog } from './revoke-dialog';

interface Props {
  holders: SbpRightsHolder[];
}

const COLUMN_COUNT = 4;

/**
 * One row per person with active rights: access level, number of rights and a revoke-all action.
 * A row expands into the person's rights, loaded on first expand, each with its own revoke action.
 */
export function RightsTable({ holders }: Props) {
  const t = useTranslations('private.studbonuspointsrights.table');

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('person')}</TableHead>
          <TableHead>{t('level')}</TableHead>
          <TableHead className="w-40 text-right">{t('rightsCount')}</TableHead>
          <TableHead className="w-12 text-right">
            <span className="sr-only">{t('actions')}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {holders.map((holder) => (
          <HolderRows key={holder.userAccountId} holder={holder} />
        ))}
      </TableBody>
    </Table>
  );
}

function HolderRows({ holder }: { holder: SbpRightsHolder }) {
  const t = useTranslations('private.studbonuspointsrights.table');
  const [isExpanded, setIsExpanded] = useState(false);
  const { rights, isLoading, isError, revoke } = useUserRights(holder.userAccountId, isExpanded);

  const toggle = () => setIsExpanded(!isExpanded);

  const level = holder.subdivisions
    .map((s) => (s.isUniversityWide ? t('university') : (s.abbreviation ?? s.name)))
    .join(', ');

  return (
    <Fragment>
      <TableRow className="align-top">
        <TableCell>
          <div className="flex items-center gap-2">
            <Button
              variant="tertiary"
              size="small"
              onClick={toggle}
              aria-label={isExpanded ? t('collapse') : t('expand')}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <span className="font-medium">{holder.fullName}</span>
          </div>
        </TableCell>
        <TableCell className="text-muted-foreground">{level}</TableCell>
        <TableCell className="text-right">{holder.rightsCount}</TableCell>
        <TableCell className="text-right">
          <RevokeDialog
            messages="revokeAll"
            descriptionValues={{ user: holder.fullName }}
            icon={<UserX className="h-4 w-4" />}
            onConfirm={() => revokeAllSbpRightsForUser(holder.userAccountId)}
          />
        </TableCell>
      </TableRow>
      {isExpanded && (isLoading || isError) && (
        <TableRow>
          <TableCell colSpan={COLUMN_COUNT} className="pl-14 text-sm text-muted-foreground">
            {isError ? t('loadError') : t('loading')}
          </TableCell>
        </TableRow>
      )}
      {isExpanded &&
        !isLoading &&
        rights?.map((item) => {
          const subdivision =
            item.scope === 'University' ? t('university') : (item.subdivisionAbbreviation ?? item.subdivisionName);
          return (
            <TableRow key={item.id} className="bg-muted/40 align-top hover:bg-muted/40">
              <TableCell colSpan={2} className="pl-14">
                <div className="flex flex-col">
                  <span>
                    {item.workKindName} · {item.loadSubTreeNumber != null ? `${item.loadSubTreeNumber}. ` : ''}
                    {item.loadName} ({subdivision})
                  </span>
                  <span className="text-xs text-muted-foreground">{item.treeName}</span>
                </div>
              </TableCell>
              <TableCell className="text-right whitespace-nowrap text-muted-foreground">
                {item.changeDate ? formatDate(item.changeDate, DATE_FORMAT) : EMPTY_VALUE}
              </TableCell>
              <TableCell className="text-right">
                <RevokeDialog
                  messages="revoke"
                  descriptionValues={{ user: item.fullName, load: item.loadName, subdivision }}
                  icon={<Trash2 className="h-4 w-4" />}
                  onConfirm={() => revoke(item.id)}
                />
              </TableCell>
            </TableRow>
          );
        })}
    </Fragment>
  );
}
