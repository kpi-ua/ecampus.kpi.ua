'use client';

import { Fragment, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Trash2, UserX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { revokeAllSbpRightsForUser, revokeSbpRight } from '@/actions/sbp-rights.actions';
import { EMPTY_VALUE } from '@/lib/constants/common';
import { formatDate } from '@/lib/utils';
import { SbpResponsibilityListItem } from '@/types/models/sbp-rights';
import { RevokeDialog } from './revoke-dialog';

interface Props {
  items: SbpResponsibilityListItem[];
}

interface Group {
  key: string;
  studyingYearName: string;
  userAccountId: number;
  fullName: string;
  scope: SbpResponsibilityListItem['scope'];
  subdivisionLabel: string;
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

  const groups = useMemo<Group[]>(() => {
    const map = new Map<string, Group>();
    for (const item of items) {
      const subdivisionLabel = item.subdivisionAbbreviation ?? item.subdivisionName;
      const key = `${item.studyingYearId}|${item.userAccountId}|${item.subdivisionId}`;
      let group = map.get(key);
      if (!group) {
        group = {
          key,
          studyingYearName: item.studyingYearName,
          userAccountId: item.userAccountId,
          fullName: item.fullName,
          scope: item.scope,
          subdivisionLabel,
          items: [],
        };
        map.set(key, group);
      }
      group.items.push(item);
    }
    return [...map.values()];
  }, [items]);

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
        {groups.map((group) => (
          <Fragment key={group.key}>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableCell colSpan={COLUMN_COUNT} className="py-2">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-muted-foreground text-xs tracking-wide whitespace-nowrap uppercase">
                    {group.studyingYearName}
                  </span>
                  <span className="font-medium">{group.fullName}</span>
                  {/* Per-user bulk revoke (KB-1336): also removes the module from their menu. */}
                  <RevokeDialog
                    messages="revokeAll"
                    descriptionValues={{ user: group.fullName }}
                    icon={<UserX className="h-4 w-4" />}
                    onConfirm={() => revokeAllSbpRightsForUser(group.userAccountId)}
                  />
                  <Badge variant={group.scope === 'University' ? 'purple' : 'blue'}>
                    {t(`scope.${group.scope === 'University' ? 'university' : 'faculty'}`)}
                  </Badge>
                  <span className="text-muted-foreground text-sm">{group.subdivisionLabel}</span>
                </div>
              </TableCell>
            </TableRow>
            {group.items.map((item) => (
              <TableRow key={item.id} className="align-top">
                <TableCell>
                  <div className="flex flex-col">
                    <span>
                      {item.loadSubTreeNumber != null ? `${item.loadSubTreeNumber}. ` : ''}
                      {item.loadName}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {item.workKindName} · {item.treeName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground whitespace-nowrap">
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
        ))}
      </TableBody>
    </Table>
  );
}
