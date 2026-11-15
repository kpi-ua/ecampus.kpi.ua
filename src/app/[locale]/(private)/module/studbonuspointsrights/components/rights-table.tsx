'use client';

import { Trash2, UserX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { group } from 'radash';
import { Fragment, useMemo } from 'react';

import { revokeAllSbpRightsForUser, revokeSbpRight } from '@/actions/sbp-rights.actions';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { formatDate } from '@/lib/utils';
import { SbpResponsibilityListItem } from '@/types/models/sbp-rights';

import { RevokeDialog } from './revoke-dialog';

interface Props {
  items: SbpResponsibilityListItem[];
}

const COLUMN_COUNT = 3;

/**
 * Lists active SBP grants. Rows are collapsed into (year, full name,
 * subdivision) groups (KB-1307) — a header row identifies the recipient
 * and the points they hold are listed underneath.
 */
export function RightsTable({ items }: Props) {
  const t = useTranslations('private.studbonuspointsrights');

  const groups = useMemo(
    () =>
      Object.values(group(items, (x) => `${x.studyingYearId}|${x.userAccountId}|${x.subdivisionId}`)).filter(
        (g): g is SbpResponsibilityListItem[] => g != null,
      ),
    [items],
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('table.load')}</TableHead>
          <TableHead className="w-40">{t('table.created')}</TableHead>
          <TableHead className="w-12 text-right">
            <span className="sr-only">{t('table.actions')}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.map((rows) => {
          const head = rows[0];
          return (
            <Fragment key={head.id}>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableCell colSpan={COLUMN_COUNT} className="py-2">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="text-xs tracking-wide whitespace-nowrap text-muted-foreground uppercase">
                      {head.studyingYearName}
                    </span>
                    <span className="font-medium">{head.fullName}</span>
                    {/* Per-user bulk revoke (KB-1336): also removes the module from their menu. */}
                    <RevokeDialog
                      messages="revokeAll"
                      descriptionValues={{ user: head.fullName }}
                      icon={<UserX className="h-4 w-4" />}
                      onConfirm={() => revokeAllSbpRightsForUser(head.userAccountId)}
                    />
                    <Badge variant={head.scope === 'University' ? 'purple' : 'blue'}>
                      {t(`scope.${head.scope === 'University' ? 'university' : 'faculty'}`)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {head.subdivisionAbbreviation ?? head.subdivisionName}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
              {rows.map((item) => (
                <TableRow key={item.id} className="align-top">
                  <TableCell>
                    <div className="flex flex-col">
                      <span>
                        {item.loadSubTreeNumber != null ? `${item.loadSubTreeNumber}. ` : ''}
                        {item.loadName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.workKindName} · {item.treeName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {item.changeDate ? formatDate(item.changeDate) : EMPTY_VALUE}
                  </TableCell>
                  <TableCell className="text-right">
                    <RevokeDialog
                      messages="revoke"
                      descriptionValues={{
                        user: item.fullName,
                        load: item.loadName,
                        subdivision: item.subdivisionAbbreviation ?? item.subdivisionName,
                        year: item.studyingYearName,
                      }}
                      icon={<Trash2 className="h-4 w-4" />}
                      onConfirm={() => revokeSbpRight(item.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}
