'use client';

import { useCallback, useState, useEffect, Dispatch, SetStateAction } from 'react';

type DefaultValue<T> = T | (() => T);

export const useLocalStorage = <T extends Object>(
  key: string,
  defaultValue?: DefaultValue<T>,
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, () => void] => {
  const [value, setValue] = useState<T | undefined>(() => {
    try {
      let jsonValue = typeof defaultValue === 'function' ? ((defaultValue as Function)() as T) : defaultValue;

      if (typeof window !== 'undefined') {
        const storageValue = window.localStorage.getItem(key);

        jsonValue = storageValue ? (JSON.parse(storageValue) as T) : undefined;
      }

      return jsonValue;
    } catch (err) {
      return undefined;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (value === undefined) {
      return window.localStorage.removeItem(key);
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const remove = useCallback(() => {
    setValue(undefined);
  }, []);

  return [value, setValue, remove];
};
