'use client';

import { createContext, ReactNode, useContext } from 'react';

export const PermissionContext = createContext<readonly string[]>([]);

interface Props {
  children: ReactNode;
  modules: string[];
}

export const PermissionProvider = ({ children, modules }: Props) => (
  <PermissionContext.Provider value={modules}>{children}</PermissionContext.Provider>
);

export const usePermission = (module: string): boolean => useContext(PermissionContext).includes(module);
