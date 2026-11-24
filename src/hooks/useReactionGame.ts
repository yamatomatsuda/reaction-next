"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { Phase, ROUNDS, average, randomWait } from "@/lib/reaction";

// ゲームの進行（状態の移り変わり）をまとめたカスタムフック

type State = { phase: Phase; times: number[]; last: number };

type Action =
  | { type: "start" } // 新しいゲーム
  | { type: "next" } // 次のラウンドへ（赤になる）
  | { type: "go" } // 緑になった
  | { type: "early" } // フライング
  | { type: "hit"; ms: number }; // 緑でタップした

const initial: State = { phase: "idle", times: [], last: 0 };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start":
      return { phase: "wait", times: [], last: 0 };
    case "next":
      return { ...state, phase: "wait" };
    case "go":
      return state.phase === "wait" ? { ...state, phase: "go" } : state;
    case "early":
      return { ...state, phase: "early" };
    case "hit": {
      const times = [...state.times, action.ms];
      return { phase: times.length >= ROUNDS ? "done" : "result", times, last: action.ms };
    }
  }
}

export function useReactionGame(onFinish: (avg: number) => void) {
  const [state, dispatch] = useReducer(reducer, initial);
  const goAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 赤になったら、ランダムな時間のあとに緑へ
  useEffect(() => {
    if (state.phase !== "wait") return;
    timer.current = setTimeout(() => {
      goAt.current = performance.now();
      dispatch({ type: "go" });
    }, randomWait());
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [state.phase, state.times.length]);

  // 5回終わったら記録を渡す
  useEffect(() => {
    if (state.phase === "done") onFinish(average(state.times));
  }, [state.phase, state.times, onFinish]);

  const tap = useCallback(() => {
    switch (state.phase) {
      case "idle":
      case "done":
        dispatch({ type: "start" });
        break;
      case "wait":
        dispatch({ type: "early" });
        break;
      case "early":
      case "result":
        dispatch({ type: "next" });
        break;
      case "go": {
        const ms = Math.round(performance.now() - goAt.current);
        try {
          navigator.vibrate?.(20);
        } catch {}
        dispatch({ type: "hit", ms });
        break;
      }
    }
  }, [state.phase]);

  return { ...state, average: average(state.times), tap };
}
