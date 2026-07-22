'use client';

import { useTranslations } from 'next-intl';

import { CaretLeftRegular } from '@/app/images';
import { Heading2, Paragraph } from '@/components/typography';
import { Link } from '@/i18n/routing';
import { formatNumber } from '@/lib/utils';
import { K7HtmlPreview } from '@/types/models/k7-form';

import { DownloadPdfButton } from './components/download-pdf-button';
import { MethodicalWorkTable } from './components/methodical-work-table';
import { OrganizationalWorkTable } from './components/organizational-work-table';
import { OtherActivitiesTable } from './components/other-activities-table';
import { OtherDutiesTable } from './components/other-duties-table';
import { ReportSection } from './components/report-section';
import { ScientificWorkTable } from './components/scientific-work-table';
import { SummaryTable } from './components/summary-table';
import { TeachingDisciplinesTable } from './components/teaching-disciplines-table';
import { EMPLOYEE_CATEGORY_TRANSLATION_KEYS } from './constants';

interface Props {
  preview: K7HtmlPreview;
}

export const K7PreviewContent = ({ preview }: Props) => {
  const tEmployeeCategory = useTranslations('private.k-reports.k-7.employee-category');
  const teachingHours = preview.section1.teachingDisciplines.reduce((total, row) => total + row.totalVolume, 0);
  const otherEducationalHours = preview.section1.otherEducationalActivities.reduce(
    (total, row) => total + row.grandTotal,
    0,
  );
  const normalizedEmployeeCategory = preview.header.employeeCategory.trim().toUpperCase();
  const employeeCategoryTranslationKey = EMPLOYEE_CATEGORY_TRANSLATION_KEYS[normalizedEmployeeCategory];
  const employeeCategory = employeeCategoryTranslationKey
    ? tEmployeeCategory(employeeCategoryTranslationKey)
    : preview.header.employeeCategory;
  const academicYear = `${preview.header.year}-${preview.header.year + 1}`;

  return (
    <main className="flex w-full min-w-0 flex-col">
      <Link
        href="/k-7"
        className="mb-[14px] inline-flex w-fit items-center gap-2 text-[12px] leading-[16px] font-semibold text-neutral-500"
      >
        <CaretLeftRegular className="size-[16px]" />
        Назад
      </Link>

      <div className="mb-[20px] flex min-w-0 flex-col items-start justify-between gap-3 sm:flex-row">
        <div className="min-w-0">
          <Heading2 className="text-[18px] leading-[22px] text-neutral-900 lg:text-[18px] lg:leading-[22px]">
            Звіт К-7 · {preview.header.totalEmploymentRate} ст. · {employeeCategory}
          </Heading2>
          <Paragraph className="mt-2 mb-0 text-[12px] !leading-[16px] font-medium text-neutral-500">
            {preview.header.fullName} · {preview.header.position} · {preview.header.departmentName} · {academicYear}
          </Paragraph>
        </div>
        <DownloadPdfButton />
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <ReportSection number="1.1" title="Викладання освітніх компонентів" hours={teachingHours}>
          <TeachingDisciplinesTable rows={preview.section1.teachingDisciplines} />
        </ReportSection>

        <ReportSection number="1.2" title="Інші види навчальної роботи" hours={otherEducationalHours}>
          <OtherActivitiesTable rows={preview.section1.otherEducationalActivities} />
        </ReportSection>

        <div className="mt-8 flex min-w-0 flex-col gap-2">
          <ReportSection number="2" title="Наукова робота" hours={preview.section6.scientificHours}>
            <ScientificWorkTable rows={preview.section2} />
          </ReportSection>

          <ReportSection number="3" title="Методична робота" hours={preview.section6.methodicalHours}>
            <MethodicalWorkTable rows={preview.section3} />
          </ReportSection>

          <ReportSection number="4" title="Організаційна робота" hours={preview.section6.organizationalHours}>
            <OrganizationalWorkTable rows={preview.section4} />
          </ReportSection>

          <ReportSection number="5" title="Інші трудові обов'язки" hours={preview.section6.otherHours}>
            <OtherDutiesTable rows={preview.section5} />
          </ReportSection>

          <ReportSection
            number="6"
            title="Зведена інформація"
            hours={preview.section6.totalHours}
            summaryText={`${formatNumber(preview.section6.totalHours, 0)} год. · ${preview.header.totalEmploymentRate} ст.`}
          >
            <SummaryTable preview={preview} />
          </ReportSection>
        </div>

        <div className="border-neutral-divider mt-2 flex flex-col items-start justify-between gap-3 rounded-[10px] border bg-white px-4 py-4 sm:flex-row sm:items-center">
          <p className="m-0 text-[14px] leading-[18px]">
            <span className="font-semibold text-neutral-900">
              Загальне навантаження: {formatNumber(preview.section6.totalHours, 0)} год.
            </span>
            <span className="font-medium text-neutral-500">
              {' '}
              · Розрахункова ставка: {preview.header.totalEmploymentRate} ст.
            </span>
          </p>
          <DownloadPdfButton />
        </div>
      </div>
    </main>
  );
};
