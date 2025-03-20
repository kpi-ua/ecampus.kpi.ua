// mocks.ts

import { Sheet } from '@/types/models/current-control/sheet';
import { Journal } from '@/types/models/current-control/journal';
import { EventsPlan } from '@/types/models/current-control/events-plan';
import { ExternalMaterials, InternalMaterials } from '@/types/models/current-control/materials';

export const sheetsMock: Sheet[] = [
  {
    creditModule: { id: '1', name: 'Дискретна математика', studyYear: '2023-2024' },
    score: 90,
    teachers: [
      {
        photo: '/photos/teacher1.jpg',
        fullName: 'Ліхоузова Тетяна Анатоліївна',
        fullNameEnglish: 'Tetyana Likhouzova',
      },
    ],
    semester: 1,
    studyYears: ['2021-2022', '2022-2023', '2023-2024'],
    cathedra: { id: '1', name: 'Кафедра математики' },
  },
];

export const journalMock: Journal[] = [
  { date: '2025-03-01', score: 85, controlType: 'Іспит', teacher: sheetsMock[0].teachers[0], note: 'Добре' },
  { date: '2025-03-15', score: 90, controlType: 'Тестування', teacher: sheetsMock[0].teachers[0], note: 'Відмінно' },
];

export const eventsPlanMock: EventsPlan[] = [
  { date: '2025-05-10', controlType: 'Екзамен', teacher: sheetsMock[0].teachers[0], note: 'Аудиторія 101' },
  { date: '2025-05-12', controlType: 'Лекція', teacher: sheetsMock[0].teachers[0], note: 'Аудиторія 102' },
];

export const externalMaterialsMock: ExternalMaterials[] = [
  {
    date: '2025-01-10',
    material: { name: 'Зовнішній ресурс 1', link: '/external1' },
    teacher: sheetsMock[0].teachers[0],
  },
];

export const internalMaterialsMock: InternalMaterials[] = [
  {
    date: '2025-01-15',
    material: { name: 'Внутрішній ресурс 1', link: '/internal1' },
    teacher: sheetsMock[0].teachers[0],
  },
];
