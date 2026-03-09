"use client";

import { useCallback, useEffect, useState } from "react";

function readStringArray(key: string): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((value): value is string => typeof value === "string");
  } catch {
    return [];
  }
}

function writeStringArray(key: string, value: string[]): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function useStoredSet(key: string) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setItems(readStringArray(key));
  }, [key]);

  const toggle = useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id];
        writeStringArray(key, next);
        return next;
      });
    },
    [key]
  );

  const has = useCallback((id: string) => items.includes(id), [items]);

  return { items, toggle, has };
}

export function useRecentList(key: string, maxItems = 15) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setItems(readStringArray(key));
  }, [key]);

  const push = useCallback(
    (id: string) => {
      setItems((prev) => {
        const deduped = [id, ...prev.filter((item) => item !== id)].slice(0, maxItems);
        writeStringArray(key, deduped);
        return deduped;
      });
    },
    [key, maxItems]
  );

  return { items, push };
}
