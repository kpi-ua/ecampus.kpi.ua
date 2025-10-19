'use client';

import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';

interface Message {
  id: number;
  sender: {
    id: number;
    name: string;
  };
  recipient: {
    id: number;
    name: string;
  };
  subject: string;
  content: string;
  createdAt: string;
}

interface Props {
  mails: Message[];
}

export default function Inbox({ mails }: Props) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(mails);

  const handleSelectRow = (id: number) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  };

  const handleDeleteSelected = () => {
    setMessages((prev) => prev.filter((message) => !selectedRows.includes(message.id)));
    setSelectedRows([]);
  };

  const handleRowClick = (message: Message) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-3">
        {selectedRows.length > 0 && (
          <>
            <span className="text-sm text-muted-foreground">{selectedRows.length} обрано:</span>
            <Button
              onClick={handleDeleteSelected}
              disabled={selectedRows.length === 0}
              variant="secondary"
              size="small"
              icon={<Trash2 className="h-4 w-4" />}
            />
          </>
        )}
      </div>
      <Table>
        <TableRow>
          <TableCell className="w-[50px]">
            <Checkbox
              checked={selectedRows.length === messages.length}
              onCheckedChange={(checked) => {
                setSelectedRows(checked ? messages.map((m) => m.id) : []);
              }}
            />
          </TableCell>
          <TableCell>Отримувач</TableCell>
          <TableCell>Лист</TableCell>
          <TableCell>Отримано</TableCell>
        </TableRow>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id} className="cursor-pointer">
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedRows.includes(message.id)}
                  onCheckedChange={() => handleSelectRow(message.id)}
                />
              </TableCell>
              <TableCell onClick={() => handleRowClick(message)}>{message.sender.name}</TableCell>
              <TableCell onClick={() => handleRowClick(message)}>{message.subject}</TableCell>
              <TableCell onClick={() => handleRowClick(message)}>{formatDate(message.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedMessage && (
            <>
              <DialogHeader className="border-b pb-4">
                <DialogTitle className="text-2xl font-semibold">{selectedMessage.subject}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-lg">{selectedMessage.sender.name}</p>
                  </div>
                  <div className="text-right text-muted-foreground">
                    <p>
                      {formatDate(selectedMessage.createdAt)} {formatTime(selectedMessage.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">До:</span> {selectedMessage.recipient.name}
                  </p>
                </div>
                <div className="text-base leading-relaxed pt-2" dangerouslySetInnerHTML={{ __html: selectedMessage.content }} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
