'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ArrowClockwise, Star } from '@/app/images';
import { deleteMail, getMail, markAsImportant } from '@/actions/msg.acitons';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Message } from '../types';
import { formatDate, formatTime } from './utils';
import { Paragraph } from '@/components/typography';

interface Props {
  mails: Message[];
}

export default function Inbox({ mails }: Props) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedMail, setSelectedMail] = useState<Message | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('private.msg.inbox');

  const handleSelectRow = (id: number) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMail(selectedRows, true);
      setIsDeleteDialogOpen(false);
      setSelectedRows([]);
      toast({
        title: t('toast.success-title-delete'),
        description: t('toast.success-description-delete'),
      });
    } catch (error) {
      toast({
        title: t('toast.error-title-delete'),
        description: t('toast.error-description-delete'),
      });
    }
  };

  const handleMarkAsImportant = async () => {
    try {
      const isImportant = selectedRows.some((id) => !mails.find((message) => message.id === id)?.isImportant);
      await markAsImportant(selectedRows, isImportant);
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
    setSelectedMail(mailData);
    setIsDialogOpen(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      router.refresh();
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
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {selectedRows.length > 0 && (
            <>
              <span className="text-muted-foreground text-sm">
                {selectedRows.length} {t('selected')}
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
        <div
          onClick={handleRefresh}
          className="flex cursor-pointer items-center justify-center"
          title={t('refresh')}
        >
          <ArrowClockwise className={`h-5 w-5 text-neutral-500 ${isRefreshing ? 'animate-spin' : ''}`} />
        </div>
      </div>
      <Table>
        <TableRow>
          <TableCell className="w-[50px]">
            <Checkbox
              checked={selectedRows.length === mails.length}
              onCheckedChange={(checked) => {
                setSelectedRows(checked ? mails.map((m) => m.id) : []);
              }}
            />
          </TableCell>
          <TableCell className="font-semibold">{t('table.sender')}</TableCell>
          <TableCell className="font-semibold">{t('table.message')}</TableCell>
          <TableCell className="font-semibold">{t('table.received')}</TableCell>
        </TableRow>
        <TableBody>
          {mails.map((mail) => (
            <TableRow key={mail.id} className="cursor-pointer">
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox checked={selectedRows.includes(mail.id)} onCheckedChange={() => handleSelectRow(mail.id)} />
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedMail && (
            <>
              <DialogHeader className="border-b pb-4">
                <DialogTitle className="text-2xl font-semibold">{selectedMail.subject}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <Paragraph className="text-lg font-semibold">{selectedMail.sender.name}</Paragraph>
                  </div>
                  <div className="text-muted-foreground text-right">
                    <Paragraph>
                      {formatDate(selectedMail.createdAt)} {formatTime(selectedMail.createdAt)}
                    </Paragraph>
                  </div>
                </div>
                <div className="text-muted-foreground text-sm">
                  <Paragraph>
                    <span className="font-medium">{t('dialog.to')}</span> {selectedMail.recipient.name}
                  </Paragraph>
                </div>
                <div
                  className="pt-2 text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedMail.content }}
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('delete-dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('delete-dialog.description', { count: selectedRows.length })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="secondary" className="w-full" onClick={() => setIsDeleteDialogOpen(false)}>
              {t('delete-dialog.cancel')}
            </Button>
            <Button variant="primary" className="w-full" onClick={handleConfirmDelete}>
              {t('delete-dialog.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
