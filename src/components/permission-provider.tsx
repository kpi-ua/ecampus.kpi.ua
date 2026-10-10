'use client';

import { createContext, ReactNode } from 'react';

export const PermissionContext = createContext<readonly string[]>([]);

interface Props {
  children: ReactNode;
  modules: string[];
}

export const PermissionProvider = ({ children, modules }: Props) => (
  <PermissionContext.Provider value={modules}>{children}</PermissionContext.Provider>
);
