'use client';

import { Fragment, useState } from 'react';
import type React from 'react';

import { Books, CaretLeftRegular, CaretUpRegular } from '@/app/images';
import { Heading2, Paragraph } from '@/components/typography';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { cn, formatNumber } from '@/lib/utils';

import { DownloadPdfButton } from './download-pdf-button';

type EmployeeCategory = 'npp' | 'pp';

interface TeachingComponentRow {
  number: number;
  component: string;
  streamId: string;
  groups: string;
  volume: string;
  practicalGroups: string;
  labGroups: string;
}

interface TeachingSemester {
  title: string;
  rows: TeachingComponentRow[];
  totalLabel: string;
}

interface ConsultationSemester {
  course: string;
  groups: string;
  students: string;
  hours: string;
}

interface ConsultationRow {
  number: string;
  workType: string;
  level: string;
  firstSemester: ConsultationSemester;
  secondSemester: ConsultationSemester;
  total: string;
}

interface SimpleReportRow {
  number: string;
  workType: string;
  description: string;
  hours: number;
}

interface SummaryReportRow {
  workType: string;
  hours: number;
}

interface K7PreviewPayload {
  id: string;
  academicYear: string;
  employee: {
    fullName: string;
    position: string;
    department: string;
    category: EmployeeCategory;
    employmentRate: number;
  };
  teachingComponents: {
    title: string;
    hours: number;
    semesters: TeachingSemester[];
  };
  consultations: {
    title: string;
    hours: number;
    rows: ConsultationRow[];
  };
  otherSections: {
    number: string;
    title: string;
    hours: number;
    rows: SimpleReportRow[];
  }[];
  summarySection: {
    number: string;
    title: string;
    hours: number;
    calculatedRate: number;
    rows: SummaryReportRow[];
  };
}

const employeeCategoryTitle: Record<EmployeeCategory, string> = {
  npp: 'Науково-педагогічний працівник',
  pp: 'Педагогічний працівник',
};

const previewPayload: K7PreviewPayload = {
  id: 'k7-2024-2025-demo',
  academicYear: '2024-2025',
  employee: {
    fullName: 'Шевченко Іван Миколайович',
    position: 'Доцент',
    department: 'АУТС',
    category: 'npp',
    employmentRate: 1.5,
  },
  teachingComponents: {
    title: 'Викладання освітніх компонентів',
    hours: 294,
    semesters: [
      {
        title: '1 семестр',
        totalLabel: 'Разом за 1 семестр',
        rows: [
          {
            number: 1,
            component: 'ФІТ; П-2024-1; МПЗ, Математичне програмне забезпечення',
            streamId: '—',
            groups: 'ІП-21, ІП-22 (25+27)',
            volume: '4.5',
            practicalGroups: '2',
            labGroups: '1',
          },
          {
            number: 2,
            component: "ФІОТ; П-2024-2; ОТ, Об'єктні технології",
            streamId: '—',
            groups: 'ІТ-31 (30)',
            volume: '3',
            practicalGroups: '1',
            labGroups: '0',
          },
        ],
      },
      {
        title: '2 семестр',
        totalLabel: 'Разом за 2 семестр',
        rows: [
          {
            number: 1,
            component: 'ФІТ; П-2024-3; АСД, Алгоритми і структури даних',
            streamId: '—',
            groups: 'ІП-11, ІП-12 (28+26)',
            volume: '6',
            practicalGroups: '2',
            labGroups: '2',
          },
          {
            number: 2,
            component: 'ФІОТ; П-2024-4; БД, Бази даних',
            streamId: '—',
            groups: 'ІТ-21 (32)',
            volume: '4',
            practicalGroups: '1',
            labGroups: '1',
          },
        ],
      },
    ],
  },
  consultations: {
    title: 'Інші види навчальної роботи',
    hours: 15,
    rows: [
      {
        number: '1',
        workType: 'Проведення консультацій перед атестаційними екзаменами',
        level: '',
        firstSemester: { course: '-', groups: '-', students: '-', hours: '-' },
        secondSemester: { course: '4', groups: 'ІП-41', students: '5', hours: '6' },
        total: '6',
      },
      {
        number: '2',
        workType: 'Проведення консультацій перед атестаційними екзаменами',
        level: 'бакалаврів',
        firstSemester: { course: '-', groups: '-', students: '-', hours: '-' },
        secondSemester: { course: '2', groups: 'ІТ-21', students: '32', hours: '4' },
        total: '4',
      },
      {
        number: '',
        workType: '',
        level: 'магістрів ОНП',
        firstSemester: { course: '-', groups: '-', students: '-', hours: '-' },
        secondSemester: { course: '4', groups: 'ІП-41', students: '5', hours: '5' },
        total: '5',
      },
      {
        number: '',
        workType: '',
        level: 'магістрів ОПП',
        firstSemester: { course: '-', groups: '-', students: '-', hours: '-' },
        secondSemester: { course: '4', groups: 'ІП-41', students: '5', hours: '6' },
        total: '6',
      },
    ],
  },
  otherSections: [
    {
      number: '2',
      title: 'Методична робота',
      hours: 42,
      rows: [
        {
          number: '1',
          workType: 'Оновлення дистанційного курсу',
          description: 'Практичні сценарії, тестові питання та інструкції до лабораторних робіт.',
          hours: 42,
        },
      ],
    },
    {
      number: '3',
      title: 'Наукова робота',
      hours: 36,
      rows: [
        {
          number: '1',
          workType: 'Підготовка наукової статті',
          description: 'Матеріали щодо застосування моделей аналізу даних у сервісах електронного кампусу.',
          hours: 36,
        },
      ],
    },
    {
      number: '4',
      title: 'Організаційна робота',
      hours: 24,
      rows: [
        {
          number: '1',
          workType: 'Робоча група з оновлення ОП',
          description: 'Аналіз пропозицій стейкхолдерів та підготовка таблиці змін.',
          hours: 24,
        },
      ],
    },
    {
      number: '5',
      title: "Інші трудові обов'язки",
      hours: 38,
      rows: [
        {
          number: '1',
          workType:
            "Член предметної комісії зі спеціальності 151 «Автоматизація та комп'ютерно-інтегровані технології».",
          description:
            "Член предметної комісії зі спеціальності 151 «Автоматизація та комп'ютерно-інтегровані технології».",
          hours: 12,
        },
        {
          number: '2',
          workType: 'Кураторство академічної групи АТ-31 (28 студентів).',
          description: 'Кураторство академічної групи АТ-31 (28 студентів).',
          hours: 12,
        },
        {
          number: '3',
          workType: 'Відповідальний за навчально-методичне забезпечення кафедри.',
          description: 'Відповідальний за навчально-методичне забезпечення кафедри.',
          hours: 14,
        },
      ],
    },
  ],
  summarySection: {
    number: '6',
    title: 'Зведена інформація',
    hours: 692,
    calculatedRate: 1.5,
    rows: [
      { workType: 'Навчальна робота', hours: 34 },
      { workType: 'Наукова робота', hours: 34 },
      { workType: 'Методична робота', hours: 34 },
      { workType: 'Організаційна робота', hours: 34 },
      { workType: "Інші трудові обов'язки", hours: 34 },
    ],
  },
};

const tableHeadClassName =
  'border-neutral-divider h-[56px] bg-white px-3 py-0 text-[12px] leading-[15px] font-medium normal-case text-neutral-500';
const tableCellClassName =
  'border-neutral-divider px-3 py-[12px] text-[12px] leading-[16px] align-middle text-neutral-900';
const consultationHeadClassName =
  'border-neutral-divider h-[32px] border-r bg-white px-3 py-0 text-[12px] leading-[15px] font-medium normal-case text-neutral-500';
const consultationCellClassName =
  'border-neutral-divider border-r px-3 py-[8px] text-[12px] leading-[16px] align-middle text-neutral-900';
const summaryCellClassName = 'border-neutral-divider px-4 py-[10px] text-[12px] leading-[16px] font-semibold';
const consultationSummaryCellClassName =
  'border-neutral-divider border-r px-4 py-[10px] text-[12px] leading-[16px] font-semibold';
const summaryRowClassName = 'bg-[#f0f1fb] hover:bg-[#f0f1fb]';
const semesterRowClassName = 'bg-[#f7f8fc] hover:bg-[#f7f8fc]';

function formatRate(rate: number) {
  return rate.toFixed(1).replace(/\.0$/, '');
}

function ReportSection({
  number,
  title,
  hours,
  summaryText,
  children,
}: {
  number: string;
  title: string;
  hours: number;
  summaryText?: string;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(true);
  const resolvedSummaryText = summaryText ?? `${formatNumber(hours, 0)} год.`;

  return (
    <section className="border-neutral-divider min-w-0 overflow-hidden rounded-[6px] border bg-white">
      <div className="border-neutral-divider flex min-h-[40px] items-center gap-3 border-b px-4 py-[11px]">
        <Books className="text-basic-blue size-[16px] shrink-0" />
        <span className="min-w-0 text-[12px] leading-[16px] font-semibold text-neutral-900">
          Розділ {number}. — {title}
        </span>
        <span className="ml-auto shrink-0 pl-2 text-[12px] leading-[16px] font-semibold text-neutral-900">
          {resolvedSummaryText}
        </span>
        <button
          className="flex size-[24px] shrink-0 cursor-pointer items-center justify-center rounded-[4px] text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
          type="button"
          onClick={() => setExpanded((current) => !current)}
        >
          <CaretUpRegular className={cn('size-[16px] transition-transform', !expanded && 'rotate-180')} />
        </button>
      </div>
      {expanded && children}
    </section>
  );
}

function TeachingComponentsTable({ semesters }: { semesters: TeachingSemester[] }) {
  return (
    <Table className="table-fixed border-collapse text-[12px] leading-[16px]">
      <colgroup>
        <col className="w-[4%]" />
        <col className="w-[34%]" />
        <col className="w-[12%]" />
        <col className="w-[20%]" />
        <col className="w-[13%]" />
        <col className="w-[9%]" />
        <col className="w-[8%]" />
      </colgroup>
      <TableHeader>
        <TableRow className="hover:bg-white">
          <TableHead className={tableHeadClassName}>№</TableHead>
          <TableHead className={tableHeadClassName}>
            Факультет (ННІ), який забезпечується потоку; абрев., назва освітнього компонента
          </TableHead>
          <TableHead className={tableHeadClassName}>Ідентифікатор потоку</TableHead>
          <TableHead className={tableHeadClassName}>Шифри академічних груп у потоці, к-сть студентів</TableHead>
          <TableHead className={tableHeadClassName}>Обсяг освітнього компонента за семестр</TableHead>
          <TableHead className={tableHeadClassName}>К-сть навч.груп практ.</TableHead>
          <TableHead className={tableHeadClassName}>К-сть навч.груп лаб.</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {semesters.map((semester) => (
          <Fragment key={semester.title}>
            <TableRow key={`${semester.title}-label`} className={semesterRowClassName}>
              <TableCell colSpan={7} className={summaryCellClassName}>
                {semester.title}
              </TableCell>
            </TableRow>
            {semester.rows.map((row) => (
              <TableRow key={`${semester.title}-${row.number}-${row.component}`} className="hover:bg-white">
                <TableCell className={tableCellClassName}>{row.number}</TableCell>
                <TableCell className={tableCellClassName}>{row.component}</TableCell>
                <TableCell className={tableCellClassName}>{row.streamId}</TableCell>
                <TableCell className={tableCellClassName}>{row.groups}</TableCell>
                <TableCell className={tableCellClassName}>{row.volume}</TableCell>
                <TableCell className={tableCellClassName}>{row.practicalGroups}</TableCell>
                <TableCell className={tableCellClassName}>{row.labGroups}</TableCell>
              </TableRow>
            ))}
            <TableRow key={`${semester.title}-total`} className={summaryRowClassName}>
              <TableCell colSpan={7} className={summaryCellClassName}>
                {semester.totalLabel}
              </TableCell>
            </TableRow>
          </Fragment>
        ))}
        <TableRow className={summaryRowClassName}>
          <TableCell colSpan={7} className={summaryCellClassName}>
            Разом за навчальний рік
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function ConsultationsTable({ rows }: { rows: ConsultationRow[] }) {
  return (
    <Table className="table-fixed border-collapse text-[12px] leading-[16px]">
      <colgroup>
        <col className="w-[4%]" />
        <col className="w-[27%]" />
        <col className="w-[9%]" />
        <col className="w-[4%]" />
        <col className="w-[8%]" />
        <col className="w-[9%]" />
        <col className="w-[6%]" />
        <col className="w-[4%]" />
        <col className="w-[8%]" />
        <col className="w-[9%]" />
        <col className="w-[6%]" />
        <col className="w-[6%]" />
      </colgroup>
      <TableHeader>
        <TableRow className="hover:bg-white">
          <TableHead rowSpan={2} className={consultationHeadClassName}>
            №
          </TableHead>
          <TableHead rowSpan={2} className={consultationHeadClassName}>
            Вид роботи
          </TableHead>
          <TableHead rowSpan={2} className={consultationHeadClassName}>
            {null}
          </TableHead>
          <TableHead colSpan={4} className={`${consultationHeadClassName} text-center`}>
            1 семестр
          </TableHead>
          <TableHead colSpan={4} className={`${consultationHeadClassName} text-center`}>
            2 семестр
          </TableHead>
          <TableHead rowSpan={2} className={consultationHeadClassName}>
            Разом за рік
          </TableHead>
        </TableRow>
        <TableRow className="hover:bg-white">
          <TableHead className={consultationHeadClassName}>Курс</TableHead>
          <TableHead className={consultationHeadClassName}>Шифри групи</TableHead>
          <TableHead className={consultationHeadClassName}>К-сть здобувачів</TableHead>
          <TableHead className={consultationHeadClassName}>Годин</TableHead>
          <TableHead className={consultationHeadClassName}>Курс</TableHead>
          <TableHead className={consultationHeadClassName}>Шифри групи</TableHead>
          <TableHead className={consultationHeadClassName}>К-сть здобувачів</TableHead>
          <TableHead className={consultationHeadClassName}>Годин</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, index) => (
          <TableRow key={`${row.number}-${row.level}-${index}`} className="hover:bg-white">
            <TableCell className={consultationCellClassName}>{row.number}</TableCell>
            <TableCell className={`${consultationCellClassName} font-semibold`}>{row.workType}</TableCell>
            <TableCell className={consultationCellClassName}>{row.level}</TableCell>
            <TableCell className={consultationCellClassName}>{row.firstSemester.course}</TableCell>
            <TableCell className={consultationCellClassName}>{row.firstSemester.groups}</TableCell>
            <TableCell className={consultationCellClassName}>{row.firstSemester.students}</TableCell>
            <TableCell className={consultationCellClassName}>{row.firstSemester.hours}</TableCell>
            <TableCell className={consultationCellClassName}>{row.secondSemester.course}</TableCell>
            <TableCell className={consultationCellClassName}>{row.secondSemester.groups}</TableCell>
            <TableCell className={consultationCellClassName}>{row.secondSemester.students}</TableCell>
            <TableCell className={consultationCellClassName}>{row.secondSemester.hours}</TableCell>
            <TableCell className={consultationCellClassName}>{row.total}</TableCell>
          </TableRow>
        ))}
        <TableRow className={summaryRowClassName}>
          <TableCell colSpan={7} className={consultationSummaryCellClassName}>
            Разом
          </TableCell>
          <TableCell className="border-neutral-divider border-r px-3 py-[10px] text-[12px] leading-[16px] font-semibold">
            -
          </TableCell>
          <TableCell className="border-neutral-divider border-r" />
          <TableCell className="border-neutral-divider border-r" />
          <TableCell className="border-neutral-divider border-r px-3 py-[10px] text-[12px] leading-[16px] font-semibold">
            {formatNumber(previewPayload.consultations.hours, 0)}
          </TableCell>
          <TableCell className="border-neutral-divider border-r px-3 py-[10px] text-[12px] leading-[16px] font-semibold">
            {formatNumber(previewPayload.consultations.hours, 0)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function SimpleReportTable({ rows }: { rows: SimpleReportRow[] }) {
  const totalHours = rows.reduce((total, row) => total + row.hours, 0);

  return (
    <Table className="table-fixed border-collapse text-[12px] leading-[16px]">
      <colgroup>
        <col className="w-[5%]" />
        <col className="w-[32%]" />
        <col className="w-[53%]" />
        <col className="w-[10%]" />
      </colgroup>
      <TableHeader>
        <TableRow className="hover:bg-white">
          <TableHead className={tableHeadClassName}>№</TableHead>
          <TableHead className={tableHeadClassName}>Вид роботи</TableHead>
          <TableHead className={tableHeadClassName}>Опис</TableHead>
          <TableHead className={tableHeadClassName}>Годин</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.number} className="hover:bg-white">
            <TableCell className={tableCellClassName}>{row.number}</TableCell>
            <TableCell className={`${tableCellClassName} font-semibold`}>{row.workType}</TableCell>
            <TableCell className={tableCellClassName}>{row.description}</TableCell>
            <TableCell className={tableCellClassName}>{formatNumber(row.hours, 0)}</TableCell>
          </TableRow>
        ))}
        <TableRow className={summaryRowClassName}>
          <TableCell colSpan={3} className={summaryCellClassName}>
            Разом
          </TableCell>
          <TableCell className="border-neutral-divider px-3 py-[10px] text-[12px] leading-[16px] font-semibold">
            {formatNumber(totalHours, 0)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function SummaryReportTable({ rows, totalHours }: { rows: SummaryReportRow[]; totalHours: number }) {
  return (
    <Table className="table-fixed border-collapse text-[12px] leading-[16px]">
      <colgroup>
        <col />
        <col className="w-[120px]" />
      </colgroup>
      <TableHeader>
        <TableRow className="hover:bg-white">
          <TableHead className="border-neutral-divider h-[40px] bg-white px-4 py-0 text-[12px] leading-[15px] font-medium text-neutral-500 normal-case">
            Вид роботи
          </TableHead>
          <TableHead className="border-neutral-divider h-[40px] bg-white px-4 py-0 text-right text-[12px] leading-[15px] font-medium text-neutral-500 normal-case">
            Год.
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.workType} className="hover:bg-white">
            <TableCell className="border-neutral-divider px-4 py-[10px] text-[12px] leading-[16px] text-neutral-900">
              {row.workType}
            </TableCell>
            <TableCell className="border-neutral-divider px-4 py-[10px] text-right text-[12px] leading-[16px] text-neutral-900">
              {formatNumber(row.hours, 0)}
            </TableCell>
          </TableRow>
        ))}
        <TableRow className={summaryRowClassName}>
          <TableCell className="border-neutral-divider px-4 py-[12px] text-[12px] leading-[16px] font-semibold text-neutral-900">
            Загальне навантаження
          </TableCell>
          <TableCell className="border-neutral-divider px-4 py-[12px] text-right text-[12px] leading-[16px] font-semibold text-neutral-900">
            {formatNumber(totalHours, 0)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default function K7PreviewPage() {
  const payload = previewPayload;
  const category = employeeCategoryTitle[payload.employee.category];
  const reportSummaryText = `${formatNumber(payload.summarySection.hours, 0)} год. · ${formatRate(
    payload.summarySection.calculatedRate,
  )} ст.`;

  return (
    <main className="flex w-full min-w-0 flex-col">
      <Link
        href="/k-7"
        className="mb-[14px] inline-flex w-fit items-center gap-2 text-[12px] leading-[16px] font-semibold text-neutral-500"
      >
        <CaretLeftRegular className="size-[16px]" />
        Назад
      </Link>

      <div className="mb-[20px] flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Heading2 className="text-[18px] leading-[22px] text-neutral-900 lg:text-[18px] lg:leading-[22px]">
            Звіт К-7 · {formatRate(payload.employee.employmentRate)} ст. · {category}
          </Heading2>
          <Paragraph className="mt-2 mb-0 text-[12px] !leading-[16px] font-medium text-neutral-500">
            {payload.employee.fullName} · {payload.employee.position} · {payload.employee.department} ·{' '}
            {payload.academicYear}
          </Paragraph>
        </div>
        <DownloadPdfButton downloadUrl={`/api/k-reports/k-7/${payload.id}/pdf`} fileName={`${payload.id}.pdf`} />
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <ReportSection number="1.1" title={payload.teachingComponents.title} hours={payload.teachingComponents.hours}>
          <TeachingComponentsTable semesters={payload.teachingComponents.semesters} />
        </ReportSection>

        <ReportSection number="1.2" title={payload.consultations.title} hours={payload.consultations.hours}>
          <ConsultationsTable rows={payload.consultations.rows} />
        </ReportSection>

        <div className="mt-8 flex min-w-0 flex-col gap-2">
          {payload.otherSections.map((section) => (
            <ReportSection key={section.number} number={section.number} title={section.title} hours={section.hours}>
              <SimpleReportTable rows={section.rows} />
            </ReportSection>
          ))}

          <ReportSection
            number={payload.summarySection.number}
            title={payload.summarySection.title}
            hours={payload.summarySection.hours}
            summaryText={reportSummaryText}
          >
            <SummaryReportTable rows={payload.summarySection.rows} totalHours={payload.summarySection.hours} />
          </ReportSection>
        </div>

        <div className="border-neutral-divider mt-2 flex min-w-0 flex-col gap-4 rounded-[10px] border bg-white px-4 py-4 sm:min-h-[66px] sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0 text-[14px] leading-[18px]">
            <span className="font-semibold text-neutral-900">
              Загальне навантаження: {formatNumber(payload.summarySection.hours, 0)} год.
            </span>
            <span className="font-medium text-neutral-500">
              {' '}
              · Розрахункова ставка: {formatRate(payload.summarySection.calculatedRate)} ст.
            </span>
          </p>
          <DownloadPdfButton downloadUrl={`/api/k-reports/k-7/${payload.id}/pdf`} fileName={`${payload.id}.pdf`} />
        </div>
      </div>
    </main>
  );
}
