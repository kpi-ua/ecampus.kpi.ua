'use client';

import { createContext, createElement, ReactNode, useContext, useState } from 'react';

const useAttestationFiltersState = (defaultYearId: number) => {
  const [onlyNotAttested, setOnlyNotAttested] = useState(false);
  const [onlyRepeated, setOnlyRepeated] = useState(false);
  const [yearId, setYearId] = useState(String(defaultYearId));
  const [semester, setSemester] = useState('all');
  const [attestationId, setAttestationId] = useState('all');
  const showRepeated = attestationId === 'all';
  const params = {
    yearId: Number(yearId),
    semester: semester === 'all' ? undefined : Number(semester),
    attestationId: attestationId === 'all' ? undefined : Number(attestationId),
  };
  const handleAttestationChange = (value: string) => {
    setAttestationId(value);
    setOnlyRepeated(false);
  };
  return {
    yearId,
    semester,
    attestationId,
    setYearId,
    setSemester,
    handleAttestationChange,
    onlyNotAttested,
    setOnlyNotAttested,
    onlyRepeated,
    setOnlyRepeated,
    showRepeated,
    params,
    enabled: !!params.yearId,
  };
};

type AttestationFiltersState = ReturnType<typeof useAttestationFiltersState>;
const AttestationFiltersContext = createContext<AttestationFiltersState | null>(null);
interface Props {
  defaultYearId: number;
  children: ReactNode;
}
export const AttestationFiltersProvider = ({ defaultYearId, children }: Props) => {
  const state = useAttestationFiltersState(defaultYearId);
  return createElement(AttestationFiltersContext.Provider, { value: state }, children);
};
export const useAttestationFilters = () => {
  const state = useContext(AttestationFiltersContext);
  if (!state) throw new Error('Attestation filters provider is required');
  return state;
};
