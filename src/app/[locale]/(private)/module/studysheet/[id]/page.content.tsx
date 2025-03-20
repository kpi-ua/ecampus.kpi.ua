import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Heading1 } from '@/components/typography/headers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from '@/i18n/routing';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { Card } from '@/components/ui/card';
import { TableSheets } from '@/components/table-sheets/TableSheets';
import {
  eventsPlanMock,
  externalMaterialsMock,
  internalMaterialsMock,
  journalMock,
} from '@/app/[locale]/(private)/module/studysheet/mock';

const INTL_NAMESPACE = 'private.study-sheet';

export function ModuleInfoPage() {
  const t = useTranslations(INTL_NAMESPACE);
  const tTable = useTranslations(`${INTL_NAMESPACE}.table`);
  const searchParams = useSearchParams();

  const SHEETS = ['Журнал', 'План заходів', 'Зовнішні матеріали', 'Внутрішні матеріали'];

  const selectedSheet = searchParams.get('sheet') || SHEETS[0];

  const subtitles = [
    { title: '2019-2020 (1 півріччя)', type: 'Навчальний рік' },
    { title: 'Дискретна математика', type: 'Кредитний модуль' },
    { title: 'Ліхоузова Тетяна Анатоліївна', type: 'Викладачі' },
  ];

  return (
    <SubLayout pageTitle="Інформація про кредитний модуль" breadcrumbs={[['/module/studysheet', 'Поточний контроль']]}>
      <div className="col-span-6">
        <Heading1>{t('title')}</Heading1>
        <div className="mt-3 flex gap-10">
          {subtitles.map((item, i) => (
            <div key={i} className="flex flex-col text-center">
              <span className="font-semibold text-basic-black">{item.title}</span>
              <span className="text-neutral-500">{item.type}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col">
          <TableSheets sheetList={SHEETS} />
          <Card className="rounded-b-6 col-span-full w-full rounded-t-none bg-white p-6 xl:col-span-5">
            {selectedSheet === 'Журнал' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Оцінка</TableHead>
                    <TableHead>Тип контролю</TableHead>
                    <TableHead>Викладач</TableHead>
                    <TableHead>Нотатка</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {journalMock.map((row) => (
                    <TableRow key={row.date}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.score}</TableCell>
                      <TableCell>{row.controlType}</TableCell>
                      <TableCell>{row.teacher.fullName}</TableCell>
                      <TableCell>{row.note}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {selectedSheet === 'План заходів' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Тип контролю</TableHead>
                    <TableHead>Викладач</TableHead>
                    <TableHead>Примітка</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventsPlanMock.map((row) => (
                    <TableRow key={row.date}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.controlType}</TableCell>
                      <TableCell>{row.teacher.fullName}</TableCell>
                      <TableCell>{row.note}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {selectedSheet === 'Зовнішні матеріали' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Матеріал</TableHead>
                    <TableHead>Викладач</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {externalMaterialsMock.map((row) => (
                    <TableRow key={row.date}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>
                        <Link href={row.material.link}>{row.material.name}</Link>
                      </TableCell>
                      <TableCell>{row.teacher.fullName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {selectedSheet === 'Внутрішні матеріали' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дата</TableHead>
                    <TableHead>Матеріал</TableHead>
                    <TableHead>Викладач</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {internalMaterialsMock.map((row) => (
                    <TableRow key={row.date}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>
                        <Link href={row.material.link}>{row.material.name}</Link>
                      </TableCell>
                      <TableCell>{row.teacher.fullName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      </div>
    </SubLayout>
  );
}
