'use client';

import { useReducer } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import { ArrowClockwise, Star } from '@/app/images';
import { getMail, getMails, markAsImportant } from '@/actions/msg.acitons';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Message } from '@/types/models/message';
import { formatDate } from '@/lib/utils';
import { Action, State } from './types';
import { DeleteDialog } from './delete-dialog';
import { MailDialog } from './mail-dialog';
import { MailFilter } from '@/types/enums/mail-filter';

interface Props {
  mails: Message[];
  filter: MailFilter;
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'setIsDialogOpen':
      return { ...state, isDialogOpen: action.isDialogOpen };
    case 'setIsDeleteDialogOpen':
      return { ...state, isDeleteDialogOpen: action.isDeleteDialogOpen };
    case 'setSelectedRows':
      return { ...state, selectedRows: action.selectedRows };
    case 'setSelectedMail':
      return { ...state, selectedMail: action.selectedMail };
    case 'setIsRefreshing':
      return { ...state, isRefreshing: action.isRefreshing };
    case 'setMails':
      return { ...state, mails: action.mails };
    default:
      return state;
  }
}

export default function Inbox({ mails, filter }': Props) {
  const [state, dispatch] = useReducer(reducer, {
    mails,
    selectedRows: [],
    selectedMail: null,
    isDialogOpen: false,
    isDeleteDialogOpen: false,
    isRefreshing: false,
  });

  const { toast } = useToast();
  const t = useTranslations('private.msg.inbox');

  const handleSelectRow = (id: number) => {
    dispatch({
      type: 'setSelectedRows',
      selectedRows: state.selectedRows.includes(id)
        ? state.selectedRows.filter((rowId) => rowId !== id)
        : [...state.selectedRows, id],
    });
  };

  const handleDeleteClick = () => {
    dispatch({ type: 'setIsDeleteDialogOpen', isDeleteDialogOpen: true });
  };

  const handleMarkAsImportant = async () => {
    try {
      const isImportant = state.selectedRows.some((id) => !state.mails.find((message) => message.id === id)?.isImportant);
      await markAsImportant(state.selectedRows, isImportant);
      toast({
        title: t('toast.success-title-mark-as-important'),
        description: t('toast.success-description-mark-as-important'),
      });
    } catch (error) {
      toast({
        title: t('toast.error-title-mark-as-important'),
        description: t('toast.error-description-mark-as-important'),
      });
    }
  };

  const handleRowClick = async (mail: Message) => {
    const mailData = await getMail(mail.id);
    dispatch({ type: 'setSelectedMail', selectedMail: mailData });
    dispatch({ type: 'setIsDialogOpen', isDialogOpen: true });
  };

  const handleRefresh = async () => {
    dispatch({ type: 'setIsRefreshing', isRefreshing: true });
    try {
      const newMails = await getMails(filter);
      dispatch({ type: 'setMails', mails: newMails });
      toast({
        title: t('toast.success-title-refresh'),
        description: t('toast.success-description-refresh'),
      });
    } catch (error) {
      toast({
        title: t('toast.error-title-refresh'),
        description: t('toast.error-description-refresh'),
      });
    } finally {
      setTimeout(() => dispatch({ type: 'setIsRefreshing', isRefreshing: false }), 500);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center h-6 gap-3">
          {state.selectedRows.length > 0 && (
            <>
              <span className="text-muted-foreground text-sm">
                {state.selectedRows.length} {t('selected')}
              </span>
              <div onClick={handleDeleteClick} className="flex cursor-pointer items-center justify-center">
                <Trash2 className="h-6 w-6 text-neutral-500" />
              </div>
              <div onClick={handleMarkAsImportant} className="flex cursor-pointer items-center justify-center">
                <Star className="h-6 w-6 text-neutral-500" />
              </div>
            </>
          )}
        </div>
        <div onClick={handleRefresh} className="flex cursor-pointer items-center justify-center" title={t('refresh')}>
          <ArrowClockwise className={`h-5 w-5 text-neutral-500 ${state.isRefreshing ? 'animate-spin' : ''}`} />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={state.mails.length > 0 && state.selectedRows.length === state.mails.length}
                disabled={state.mails.length === 0}
                onCheckedChange={(checked) => {
                  dispatch({ type: 'setSelectedRows', selectedRows: checked ? state.mails.map((m) => m.id) : [] });
                }}
              />
            </TableHead>
            <TableHead className="font-semibold">{t('table.sender')}</TableHead>
            <TableHead className="font-semibold">{t('table.message')}</TableHead>
            <TableHead className="font-semibold">{t('table.received')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.mails.map((mail) => (
            <TableRow key={mail.id} className="cursor-pointer">
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={state.selectedRows.includes(mail.id)}
                  onCheckedChange={() => handleSelectRow(mail.id)}
                />
              </TableCell>
              <TableCell onClick={() => handleRowClick(mail)}>{mail.sender.name}</TableCell>
              <TableCell onClick={() => handleRowClick(mail)}>
                <div className="flex max-w-[600px] items-center gap-2">
                  <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{mail.subject}</span>
                  {mail.isImportant && (
                    <Badge variant="neutral" className="text-brand-500 flex-shrink-0 bg-neutral-50">
                      <Star className="text-brand-500 fill-brand-500 h-4 w-4" /> {t('badge.important')}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell onClick={() => handleRowClick(mail)}>{formatDate(mail.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <MailDialog isDialogOpen={state.isDialogOpen} dispatch={dispatch} selectedMail={state.selectedMail} />

      <DeleteDialog
        selectedRows={state.selectedRows}
        isDeleteDialogOpen={state.isDeleteDialogOpen}
        dispatch={dispatch}
      />
    </div>
  );
}
