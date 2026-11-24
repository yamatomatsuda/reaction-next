"use client";

import { useReactionGame } from "@/hooks/useReactionGame";
import { useRecords } from "@/hooks/useRecords";
import { ROUNDS, rate } from "@/lib/reaction";
import { ProgressDots } from "./ProgressDots";
import { RecentRecords } from "./RecentRecords";
import { TapPad } from "./TapPad";

function Ms({ value }: { value: number }) {
  return (
    <>
      <span className="font-num tabular-nums">{value}</span>
      <span className="text-[.5em]">ms</span>
    </>
  );
}

export function ReactionGame() {
  const { records, best, add } = useRecords();
  const game = useReactionGame(add);
  const isNewBest = game.phase === "done" && game.average <= best;

  const big = "text-[clamp(2.2rem,11vw,4rem)] font-extrabold leading-tight text-balance";
  const sub = "text-base leading-relaxed opacity-90 text-balance";

  return (
    <>
      <header className="flex items-baseline justify-between gap-3">
        <h1 className="text-lg font-extrabold">反射神経テスト</h1>
        <p className="text-sm text-muted">
          自己ベスト <b className="font-num text-fg tabular-nums">{best ? `${best}ms` : "—"}</b>
        </p>
      </header>

      <TapPad phase={game.phase} onTap={game.tap}>
        {game.phase === "idle" && (
          <>
            <div className={big}>タップで<br />スタート</div>
            <p className={sub}>画面が<b>緑</b>になった瞬間にタップ。{ROUNDS}回の平均で判定します。</p>
          </>
        )}
        {game.phase === "wait" && (
          <>
            <div className={big}>待って…</div>
            <p className={sub}>緑になるまでガマン</p>
          </>
        )}
        {game.phase === "go" && <div className={big}>タップ！</div>}
        {game.phase === "early" && (
          <>
            <div className={big}>フライング！</div>
            <p className={sub}>タップしてやり直し</p>
          </>
        )}
        {game.phase === "result" && (
          <>
            <div className={big}><Ms value={game.last} /></div>
            <p className={sub}>{game.times.length} / {ROUNDS} 回目 ・ タップで次へ</p>
          </>
        )}
        {game.phase === "done" && (
          <>
            <div className={big}>平均 <Ms value={game.average} /></div>
            <p className={sub}>
              {rate(game.average).label}
              {isNewBest && <><br />🎉 自己ベスト更新</>}
              <br />
              <span className="font-num tabular-nums">{game.times.join(" / ")}</span>
              <br />
              タップでもう一度
            </p>
          </>
        )}
      </TapPad>

      <ProgressDots total={ROUNDS} done={game.times.length} />
      <RecentRecords records={records} best={best} />
    </>
  );
}
