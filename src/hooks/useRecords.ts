"use client";

import { useCallback, useSyncExternalStore } from "react";

// 自己ベストと最近の記録を、この端末のブラウザ（localStorage）に保存する。
// localStorage は React の外にあるデータなので、useSyncExternalStore でつなぐ。

export type GameRecord = { avg: number; at: number };

const KEY = "reaction-next:records";
const KEEP = 10;
const EMPTY: GameRecord[] = [];

let cache: GameRecord[] | null = null;
const listeners = new Set<() => void>();

function read(): GameRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as GameRecord[]) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => (cache ??= read());
const getServerSnapshot = () => EMPTY; // サーバーには localStorage がないので空

export function useRecords() {
  const records = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const add = useCallback((avg: number) => {
    cache = [{ avg, at: Date.now() }, ...getSnapshot()].slice(0, KEEP);
    try {
      localStorage.setItem(KEY, JSON.stringify(cache));
    } catch {}
    listeners.forEach((l) => l());
  }, []);

  const best = records.length ? Math.min(...records.map((r) => r.avg)) : 0;
  return { records, best, add };
}
