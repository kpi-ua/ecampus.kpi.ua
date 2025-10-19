'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heading4 } from '@/components/typography';
import { Send } from 'lucide-react';

export default function Compose() {
  const [recipientType, setRecipientType] = useState<'employee' | 'student'>('student');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('normal');

  const handleSubmit = () => {
    // Handle form submission
    console.log({ recipientType, subject, content, priority });
  };

  return (
    <div className="w-full">
      <Heading4 className="mb-6">Нове повідомлення</Heading4>

      <Tabs defaultValue="individual" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="individual">Індивідуальне</TabsTrigger>
          <TabsTrigger value="student">Студент</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-6 mt-6">
          {/* Recipient Type Selection */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="recipientType"
                value="employee"
                checked={recipientType === 'employee'}
                onChange={() => setRecipientType('employee')}
                className="w-4 h-4"
              />
              <span>Співробітник</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="recipientType"
                value="student"
                checked={recipientType === 'student'}
                onChange={() => setRecipientType('student')}
                className="w-4 h-4"
              />
              <span>Студент</span>
            </label>
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Підрозділ</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dept1">Підрозділ 1</SelectItem>
                  <SelectItem value="dept2">Підрозділ 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Навчальна група</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="group1">Група 1</SelectItem>
                  <SelectItem value="group2">Група 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>ПІБ</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="person1">Особа 1</SelectItem>
                  <SelectItem value="person2">Особа 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Recipients Section */}
          <div className="space-y-2">
            <Label>Одержувач(і)</Label>
            <div className="border rounded-md p-4 min-h-[60px] text-sm text-muted-foreground">
              Оберіть одержувачів із пунктів вище
            </div>
            <p className="text-xs text-muted-foreground">
              підтримується масове відправлення повідомлень подібно e-mail списками
            </p>
          </div>

          {/* Subject and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4">
            <div className="space-y-2">
              <Label>
                Тема повідомлення <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Тема повідомлення"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Пріоритет</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Низький</SelectItem>
                  <SelectItem value="normal">Нормальний</SelectItem>
                  <SelectItem value="high">Високий</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>
              Текст повідомлення <span className="text-destructive">*</span>
            </Label>
            <textarea
              placeholder="Текст повідомлення"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={1000}
              className="w-full min-h-[200px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="text-right text-xs text-muted-foreground">{content.length}/1000</div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button onClick={handleSubmit} variant="primary" size="medium" icon={<Send className="h-4 w-4" />}>
              Відправити
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="student" className="mt-6">
          <p className="text-muted-foreground">Студент функціонал</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
