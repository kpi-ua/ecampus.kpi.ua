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

export default function Sent() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: { id: 1, name: 'Єрмак Д. Р.' },
      recipient: { id: 101, name: 'Мельник Ю. І.' },
      subject: 'Підтвердження участі в тренінгу',
      content:
        'Дякую за запрошення! Підтверджую свою участь у тренінгу з особистої ефективності 25 травня о 14:00. З нетерпінням чекаю на цікаві матеріали та практичні поради.',
      createdAt: '2025-05-20T10:30:00Z',
    },
    {
      id: 2,
      sender: { id: 1, name: 'Єрмак Д. Р.' },
      recipient: { id: 102, name: 'Бондаренко В. В.' },
      subject: 'Питання щодо лекції',
      content:
        'Доброго дня! Чи будуть доступні матеріали лекції після її проведення? Також хотів би дізнатися, чи є можливість задати питання під час лекції.',
      createdAt: '2025-05-19T16:15:00Z',
    },
    {
      id: 3,
      sender: { id: 1, name: 'Єрмак Д. Р.' },
      recipient: { id: 103, name: 'Гриценко П. Ф.' },
      subject: 'Реєстрація на семінар',
      content:
        'Вітаю! Хочу зареєструватися на семінар з фінансової грамотності. Прошу підтвердити мою участь та надіслати додаткову інформацію про програму семінару.',
      createdAt: '2025-05-18T12:00:00Z',
    },
    {
      id: 4,
      sender: { id: 1, name: 'Єрмак Д. Р.' },
      recipient: { id: 104, name: 'Тимошенко О. А.' },
      subject: 'Запит на детальну програму курсу',
      content:
        'Добрий день! Дуже зацікавлений у курсі з цифрового маркетингу. Чи можете надіслати детальну програму навчання та вартість участі? Дякую!',
      createdAt: '2025-05-17T14:45:00Z',
    },
    {
      id: 5,
      sender: { id: 1, name: 'Єрмак Д. Р.' },
      recipient: { id: 105, name: 'Федорчук Л. Г.' },
      subject: 'Пропозиція доповіді',
      content:
        'Шановна Людмило Григорівно! Хотів би запропонувати свою доповідь на конференції з екології на тему "Відновлювальні джерела енергії в міському середовищі". Чи можливо це?',
      createdAt: '2025-05-16T11:30:00Z',
    },
  ]);

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
              <TableCell onClick={() => handleRowClick(message)}>{message.recipient.name}</TableCell>
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
                <DialogTitle className="text-2xl font-semibold">{selectedMessage.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-semibold text-lg">{selectedMessage.author}</p>
                  </div>
                  <div className="text-right text-muted-foreground">
                    <p>
                      {selectedMessage.date} о {selectedMessage.time}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">До:</span> {selectedMessage.recipient}
                  </p>
                </div>
                <div className="text-base leading-relaxed pt-2">{selectedMessage.fullContent}</div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
