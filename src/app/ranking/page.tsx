import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { getAllTimeTop, getTodayTop, type RankingRow } from "@/lib/ranking";

export const metadata: Metadata = { title: "ランキング | 反射神経テスト" };

// 見出しなどはすぐ表示し、データベースから読む表だけ後から流し込む（Suspense）
export default function RankingPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 pb-[calc(env(safe-area-inset-bottom)+24px)] pl-[max(16px,env(safe-area-inset-left))] pr-[max(16px,env(safe-area-inset-right))] pt-[calc(env(safe-area-inset-top)+12px)]">
      <header className="flex items-baseline justify-between gap-3">
        <h1 className="text-lg font-extrabold">ランキング</h1>
        <Link href="/" className="text-sm font-bold text-idle underline-offset-4 hover:underline">
          ← ゲームに戻る
        </Link>
      </header>

      <Board title="今日のTOP10" empty="今日はまだ誰も登録していません。一番乗りのチャンスです。">
        {getTodayTop}
      </Board>
      <Board title="歴代TOP20" empty="まだ記録がありません。">
        {getAllTimeTop}
      </Board>

      <p className="text-center text-xs text-muted">
        5回の平均タイムで順位を決めます。「今日」は日本時間の0時に切り替わります。
      </p>
    </main>
  );
}

function Board({ title, empty, children: load }: { title: string; empty: string; children: () => Promise<RankingRow[]> }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-bold tracking-wider text-muted">{title}</h2>
      <Suspense fallback={<p className="rounded-2xl bg-panel px-4 py-6 text-center text-sm text-muted">読み込み中…</p>}>
        <Rows load={load} empty={empty} />
      </Suspense>
    </section>
  );
}

const fmt = new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", month: "numeric", day: "numeric" });

async function Rows({ load, empty }: { load: () => Promise<RankingRow[]>; empty: string }) {
  await connection(); // アクセスのたびに最新を読む
  let rows: RankingRow[];
  try {
    rows = await load();
  } catch (e) {
    console.error("ranking load failed", e);
    return <p className="rounded-2xl bg-panel px-4 py-6 text-center text-sm text-wait">ランキングを読み込めませんでした。</p>;
  }
  if (rows.length === 0) {
    return <p className="rounded-2xl bg-panel px-4 py-6 text-center text-sm text-muted">{empty}</p>;
  }

  const medal = ["bg-[#d4a72c] text-white", "bg-[#9aa3b5] text-white", "bg-[#b9773f] text-white"];
  return (
    <ol className="flex flex-col overflow-hidden rounded-2xl bg-panel">
      {rows.map((r, i) => (
        <li key={i} className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 border-t border-bg px-4 py-2.5 first:border-t-0">
          <span
            className={`grid size-7 place-items-center rounded-full font-num text-sm font-bold tabular-nums ${medal[r.rank - 1] ?? "text-muted"}`}
          >
            {r.rank}
          </span>
          <span className="min-w-0 truncate font-bold">{r.name}</span>
          <span className="flex items-baseline gap-2">
            <span className="text-xs text-muted tabular-nums">{fmt.format(r.createdAt)}</span>
            <span className="w-16 text-right font-num font-bold tabular-nums">{r.avgMs}ms</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
