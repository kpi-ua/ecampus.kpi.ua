import { Heading1, Heading6 } from '@/components/typography/headers';
import { SubLayout } from '../../sub-layout';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Paragraph } from '@/components/typography/paragraph';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableFooter,
  TableBody,
  TableCaption,
} from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { ProfilePicture } from '@/components/ui/profile-picture';
import React from 'react';
import { Card } from '@/components/ui/card';
import { sheetsMock } from '@/app/[locale]/(private)/module/studysheet/mock';

const INTL_NAMESPACE = 'private.study-sheet';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: INTL_NAMESPACE });

  return {
    title: t('title'),
  };
}

export default function EmploymentPage() {
  const t = useTranslations(INTL_NAMESPACE);
  const tSemester = useTranslations(`${INTL_NAMESPACE}.semester`);
  const tTable = useTranslations(`${INTL_NAMESPACE}.table`);
  return (
    <SubLayout pageTitle={t('title')}>
      <div className="col-span-6">
        <Heading1>{t('title')}</Heading1>
        <Paragraph className="text-neutral-700">{t('subtitle')}</Paragraph>
        <Card className="rounded-b-6 col-span-full w-full bg-white p-6 xl:col-span-5">
          <div className="flex items-center">
            <Heading6 className="mr-auto text-neutral-900">{t('your-information')}</Heading6>
            <Paragraph className="mr-5 text-lg font-semibold text-neutral-700">{t('study-year')}</Paragraph>
            <Paragraph className="mr-5 text-lg font-semibold text-neutral-700">{tSemester('title')}</Paragraph>
            <Tabs defaultValue="all" className="w-[210px]">
              <TabsList size="small">
                <TabsTrigger value="all">{tSemester('all')}</TabsTrigger>
                <TabsTrigger value="first">{tSemester('first')}</TabsTrigger>
                <TabsTrigger value="second">{tSemester('second')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tTable('subject')}</TableHead>
                <TableHead>{tTable('score')}</TableHead>
                <TableHead>{tTable('teacher')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sheetsMock.map((sheet) => (
                <TableRow key={sheet.creditModule.id}>
                  <TableCell className="font-medium">
                    <Link
                      className="text-sm text-basic-black underline"
                      href={`/module/studysheet/${sheet.creditModule.id}`}
                    >
                      {sheet.creditModule.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge className="text-basic-blue">{sheet.score}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <ProfilePicture size="xs" src={sheet.teachers[0].photo} />
                      <span className="text-sm font-semibold text-basic-black">{sheet.teachers[0].fullName}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </SubLayout>
  );
}
