'use client';

import { createContext, createElement, ReactNode, useContext } from 'react';

import { CuratorAcademicYear } from '@/app/[locale]/(private)/module/curatorlecturer/types';

const CuratorAcademicYearContext = createContext<CuratorAcademicYear | null>(null);

interface Props {
  year: CuratorAcademicYear;
  children: ReactNode;
}

export const CuratorAcademicYearProvider = ({ year, children }: Props) =>
  createElement(CuratorAcademicYearContext.Provider, { value: year }, children);

export const useCuratorAcademicYear = () => {
  const year = useContext(CuratorAcademicYearContext);
  if (year === null) {
    throw new Error('Curator academic year provider is required');
  }
  return year;
};
