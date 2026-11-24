import type { GameRecord } from "@/hooks/useRecords";

type Props = { records: GameRecord[]; best: number };

const fmt = new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });

export function RecentRecords({ records, best }: Props) {
  if (records.length === 0) {
    return <p className="text-center text-sm text-muted">5回やると、ここに記録が並びます。</p>;
  }
  // 棒の長さ：遅いほど短く（150ms〜500msの範囲で表示）
  const width = (ms: number) => `${Math.max(8, Math.min(100, ((500 - ms) / 350) * 100))}%`;

  return (
    <section aria-label="最近の記録">
      <h2 className="mb-2 text-xs font-bold tracking-wider text-muted">最近の記録</h2>
      <ul className="flex flex-col gap-1.5">
        {records.slice(0, 5).map((r) => (
          <li key={r.at} className="grid grid-cols-[5.5rem_1fr_3.5rem] items-center gap-2 text-sm">
            <span className="text-muted tabular-nums">{fmt.format(r.at)}</span>
            <span className="h-2 overflow-hidden rounded-full bg-panel">
              <span className={`block h-full rounded-full ${r.avg === best ? "bg-go" : "bg-idle"}`} style={{ width: width(r.avg) }} />
            </span>
            <span className="text-right font-num tabular-nums">{r.avg}ms</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
