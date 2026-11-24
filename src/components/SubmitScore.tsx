"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitScore, type SubmitState } from "@/app/actions";
import { NAME_MAX } from "@/lib/score-rules";

const NAME_KEY = "reaction-next:name";

function savedName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

type Props = { times: number[] };

export function SubmitScore({ times }: Props) {
  const [state, action, pending] = useActionState<SubmitState, FormData>(submitScore, { status: "idle" });
  const [name] = useState(savedName);

  if (state.status === "saved") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-2xl bg-panel px-4 py-3 text-sm">
        <p>
          <b>{state.name}</b> さん、今日 <b className="font-num">{state.today}</b> 位 ／ 歴代 <b className="font-num">{state.allTime}</b> 位
        </p>
        <Link href="/ranking" className="font-bold text-idle underline underline-offset-4">
          ランキングを見る →
        </Link>
      </div>
    );
  }

  return (
    <form
      action={action}
      onSubmit={(e) => {
        const v = new FormData(e.currentTarget).get("name");
        try {
          localStorage.setItem(NAME_KEY, String(v ?? ""));
        } catch {}
      }}
      className="flex flex-col gap-2 rounded-2xl bg-panel px-4 py-3"
    >
      <label htmlFor="rank-name" className="text-xs font-bold tracking-wider text-muted">
        ランキングに登録
      </label>
      <div className="flex gap-2">
        <input
          id="rank-name"
          name="name"
          defaultValue={name}
          maxLength={NAME_MAX}
          required
          placeholder="ニックネーム"
          autoComplete="nickname"
          enterKeyHint="send"
          className="min-w-0 flex-1 rounded-xl border-2 border-muted/40 bg-bg px-3 py-2 text-base outline-none focus:border-idle"
        />
        <input type="hidden" name="times" value={JSON.stringify(times)} />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-xl bg-idle px-4 py-2 font-bold text-white disabled:opacity-60"
        >
          {pending ? "登録中…" : "登録"}
        </button>
      </div>
      {state.status === "error" && (
        <p role="alert" className="text-sm font-bold text-wait">
          {state.message}
        </p>
      )}
    </form>
  );
}
