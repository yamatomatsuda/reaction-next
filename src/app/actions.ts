"use server";

// サーバーで動く関数（Server Action）。画面のフォームから直接呼べる。
import { insertScore } from "@/lib/ranking";
import { validateScore } from "@/lib/score-rules";

export type SubmitState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "saved"; name: string; avg: number; allTime: number; today: number };

export async function submitScore(_prev: SubmitState, formData: FormData): Promise<SubmitState> {
  let times: unknown;
  try {
    times = JSON.parse(String(formData.get("times") ?? "[]"));
  } catch {
    return { status: "error", message: "記録の形式が正しくありません" };
  }

  // 画面から来たデータは信用せず、サーバーでもう一度チェックして平均も計算し直す
  const result = validateScore({ name: formData.get("name"), times });
  if (!result.ok) return { status: "error", message: result.error };

  try {
    const rank = await insertScore(result.value);
    return { status: "saved", name: result.value.name, avg: result.value.avg, ...rank };
  } catch (e) {
    console.error("submitScore failed", e);
    return { status: "error", message: "登録できませんでした。時間をおいてもう一度試してください" };
  }
}
