// ゲームのルールと計算（画面から切り離した「純粋な」ロジック）

export const ROUNDS = 5;
export const MIN_WAIT_MS = 1200;
export const MAX_EXTRA_WAIT_MS = 2800;

export type Phase =
  | "idle" // スタート前
  | "wait" // 赤：待機中
  | "go" // 緑：今タップ！
  | "early" // フライング
  | "result" // 1回分の結果
  | "done"; // 5回終わって平均を表示

export type Rating = { label: string; tone: "great" | "good" | "ok" | "slow" };

export function average(times: number[]): number {
  if (times.length === 0) return 0;
  return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
}

export function rate(ms: number): Rating {
  if (ms < 200) return { label: "プロゲーマー級！", tone: "great" };
  if (ms < 250) return { label: "かなり速い！", tone: "great" };
  if (ms < 300) return { label: "いい感じ。平均以上です", tone: "good" };
  if (ms < 380) return { label: "ふつう。まだ伸びます", tone: "ok" };
  return { label: "ちょっと眠い？", tone: "slow" };
}

export function randomWait(): number {
  return MIN_WAIT_MS + Math.random() * MAX_EXTRA_WAIT_MS;
}
