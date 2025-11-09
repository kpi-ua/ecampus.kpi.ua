import { deleteMail } from '@/actions/msg.acitons';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogContent,
  DialogHeader,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { Action } from './types';
import { Dispatch } from 'react';

interface Props {
  selectedRows: number[];
  isOpen: boolean;
  dispatch: Dispatch<Action>;
}

export function DeleteDialog({ selectedRows, isOpen, dispatch }: Props) {
  const { toast } = useToast();
  const t = useTranslations('private.msg.inbox');

  const handleConfirmDelete = async () => {
    try {
      await deleteMail(selectedRows, true);
      dispatch({ type: 'setOpenedDialog', openedDialog: null });
      dispatch({ type: 'setSelectedRows', selectedRows: [] });
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

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => dispatch({ type: 'setOpenedDialog', openedDialog: open ? 'delete' : null })}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('delete-dialog.title')}</DialogTitle>
          <DialogDescription>{t('delete-dialog.description', { count: selectedRows.length })}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => dispatch({ type: 'setOpenedDialog', openedDialog: null })}
          >
            {t('delete-dialog.cancel')}
          </Button>
          <Button variant="primary" className="w-full" onClick={handleConfirmDelete}>
            {t('delete-dialog.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
