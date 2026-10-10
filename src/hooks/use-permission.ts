'use client';

import { useContext } from 'react';

import { PermissionContext } from '@/components/permission-provider';

export const usePermission = (module: string): boolean => useContext(PermissionContext).includes(module);
