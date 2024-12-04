'use client';

import { useCallback, useState, useEffect, Dispatch, SetStateAction } from "react";

type DefaultValue<T> = T | (() => T);

const ensureWindowObject = () => {
  if (typeof window !== "undefined") {
    return false;
  }

  return [];
};

function useStorage<T>(
  key: string,
  storageObject: Storage,
  defaultValue?: DefaultValue<T>
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, () => void] {
  const [value, setValue] = useState<T | undefined>(() => {
    const jsonValue = storageObject.getItem(key);

    if (jsonValue != null) {
      return JSON.parse(jsonValue) as T;
    }

    if (typeof defaultValue === "function") {
      return (defaultValue as Function)() as T;
    }

    return defaultValue;
  });

  useEffect(() => {
    if (value === undefined) {
      return storageObject.removeItem(key);
    }

    storageObject.setItem(key, JSON.stringify(value));
  }, [key, value, storageObject]);

  const remove = useCallback(() => {
    setValue(undefined);
  }, []);

  return [value, setValue, remove];
}

export function useLocalStorage<T>(key: string, defaultValue?: DefaultValue<T>) {
  return ensureWindowObject() || useStorage<T>(key, window.localStorage, defaultValue);
}

export function useSessionStorage<T>(key: string, defaultValue?: DefaultValue<T>) {
  return ensureWindowObject() || useStorage<T>(key, window.sessionStorage, defaultValue);
}