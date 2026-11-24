// ランキング登録のルール（画面側とサーバー側の両方で使う）
import { ROUNDS, average } from "./reaction";

export const NAME_MAX = 12;
// 人間がこれより速く反応するのはほぼ不可能（見てから押したのではなく「勘」）
export const MIN_VALID_MS = 100;
export const MAX_VALID_MS = 2000;

export type ScoreInput = { name: string; times: number[] };
export type ValidScore = { name: string; times: number[]; avg: number };

export function validateScore(input: unknown): { ok: true; value: ValidScore } | { ok: false; error: string } {
  if (typeof input !== "object" || input === null) return { ok: false, error: "データの形式が正しくありません" };
  const { name, times } = input as Partial<ScoreInput>;

  const trimmed = typeof name === "string" ? name.trim().replace(/\s+/g, " ") : "";
  if (!trimmed) return { ok: false, error: "名前を入力してください" };
  if ([...trimmed].length > NAME_MAX) return { ok: false, error: `名前は${NAME_MAX}文字以内にしてください` };

  if (!Array.isArray(times) || times.length !== ROUNDS) {
    return { ok: false, error: `${ROUNDS}回分の記録が必要です` };
  }
  if (!times.every((t) => Number.isInteger(t) && t >= MIN_VALID_MS && t <= MAX_VALID_MS)) {
    return { ok: false, error: `${MIN_VALID_MS}ms未満や${MAX_VALID_MS}msを超える記録は登録できません` };
  }

  return { ok: true, value: { name: trimmed, times, avg: average(times) } };
}
