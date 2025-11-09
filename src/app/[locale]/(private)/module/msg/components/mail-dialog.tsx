import { Paragraph } from '@/components/typography';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDate, formatTime } from '@/lib/utils';
import { Dispatch } from 'react';
import { Action } from './types';
import { Message } from '@/types/models/message';
import { useTranslations } from 'next-intl';

interface Props {
  isDialogOpen: boolean;
  dispatch: Dispatch<Action>;
  selectedMail: Message | null;
}

export function MailDialog({ isDialogOpen, dispatch, selectedMail }: Props) {
  const t = useTranslations('private.msg.inbox');

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => dispatch({ type: 'setIsDialogOpen', isDialogOpen: open })}>
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
  );
}
