'use client';

import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Heading1, Heading5 } from '@/components/typography';

interface Message {
  id: string;
  author: string;
  content: string;
  date: string;
}

export default function Important() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      author: 'John Doe',
      content: 'Hello, this is a test message',
      date: '2025-09-15',
    },
    {
      id: '2',
      author: 'Jane Smith',
      content: 'Another test message here',
      date: '2025-09-14',
    },
    {
      id: '3',
      author: 'Mike Johnson',
      content: 'Important notification about the course',
      date: '2025-09-13',
    },
    {
      id: '4',
      author: 'Sarah Williams',
      content: 'Please review the attached materials',
      date: '2025-09-12',
    },
    {
      id: '5',
      author: 'Robert Brown',
      content: 'Meeting scheduled for next week',
      date: '2025-09-11',
    },
  ]);

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
  };

  const handleDeleteSelected = () => {
    setMessages((prev) => prev.filter((message) => !selectedRows.includes(message.id)));
    setSelectedRows([]);
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <Heading5>Вихідні</Heading5>
        <Button onClick={handleDeleteSelected} disabled={selectedRows.length === 0} variant="primary">
          Delete Selected
        </Button>
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
            <TableRow key={message.id}>
              <TableCell>
                <Checkbox
                  checked={selectedRows.includes(message.id)}
                  onCheckedChange={() => handleSelectRow(message.id)}
                />
              </TableCell>
              <TableCell>{message.author}</TableCell>
              <TableCell>{message.content}</TableCell>
              <TableCell>{message.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
