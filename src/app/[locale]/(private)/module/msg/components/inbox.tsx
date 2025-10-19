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

export default function Inbox() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: { id: 101, name: 'Мельник Ю. І.' },
      recipient: { id: 1, name: 'Єрмак Д. Р.' },
      subject: 'Запрошення на семінар з нових технологій в освіті',
      content:
        'Запрошуємо вас на семінар, присвячений новітнім технологіям в освіті! Долучайтеся до нас, щоб дізнатися про інноваційні підходи та інструменти, які змінюють навчальний процес. Семінар відбудеться 15 березня о 10:00 в конференц-залі "Технології майбутнього". Не пропустіть можливість обмінятися досвідом з провідними експертами!',
      createdAt: '2025-05-20T09:17:00Z',
    },
    {
      id: 2,
      sender: { id: 102, name: 'Бондаренко В. В.' },
      recipient: { id: 1, name: 'Єрмак Д. Р.' },
      subject: 'Лекція з історії мистецтв',
      content:
        'Запрошуємо на лекцію з історії мистецтв, де ми розглянемо розвиток живопису у епоху Відродження. Лекція відбудеться 22 травня о 16:00 в аудиторії 301.',
      createdAt: '2025-05-19T15:30:00Z',
    },
    {
      id: 3,
      sender: { id: 103, name: 'Гриценко П. Ф.' },
      recipient: { id: 1, name: 'Єрмак Д. Р.' },
      subject: 'Семінар по фінансовій грамотності',
      content:
        'Приєднуйтесь до семінару з фінансової грамотності! Ми обговоримо основи інвестування, планування бюджету та управління особистими фінансами. Семінар відбудеться 28 травня о 10:00.',
      createdAt: '2025-05-18T11:45:00Z',
    },
    {
      id: 4,
      sender: { id: 104, name: 'Тимошенко О. А.' },
      recipient: { id: 1, name: 'Єрмак Д. Р.' },
      subject: 'Курс з цифрового маркетингу',
      content:
        'Запрошуємо на курс з цифрового маркетингу! Вивчіть основи SEO, контекстної реклами та SMM. Курс стартує 1 червня та триватиме 6 тижнів. Реєстрація відкрита до 25 травня.',
      createdAt: '2025-05-17T13:20:00Z',
    },
    {
      id: 5,
      sender: { id: 105, name: 'Федорчук Л. Г.' },
      recipient: { id: 1, name: 'Єрмак Д. Р.' },
      subject: 'Конференція з екології',
      content:
        'Запрошуємо на конференцію з екології та сталого розвитку! Обговоримо актуальні екологічні проблеми та шляхи їх вирішення. Конференція відбудеться 30 травня о 09:00 в головному корпусі.',
      createdAt: '2025-05-16T10:05:00Z',
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
                      {formatDate(selectedMessage.createdAt)} о {formatTime(selectedMessage.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">До:</span> {selectedMessage.recipient.name}
                  </p>
                </div>
                <div className="text-base leading-relaxed pt-2">{selectedMessage.content}</div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
