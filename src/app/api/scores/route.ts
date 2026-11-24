// POST /api/scores … スマホアプリなど、外から使うための登録API
// 送るもの: { "name": "ニックネーム", "times": [231, 245, 219, 260, 240] }
import { insertScore } from "@/lib/ranking";
import { validateScore } from "@/lib/score-rules";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON の形式が正しくありません" }, { status: 400 });
  }

  // Webのフォームと同じルールでチェックし、平均もサーバーで計算し直す
  const result = validateScore(body);
  if (!result.ok) return Response.json({ error: result.error }, { status: 400 });

  try {
    const rank = await insertScore(result.value);
    return Response.json({ name: result.value.name, avg: result.value.avg, ...rank }, { status: 201 });
  } catch (e) {
    console.error("POST /api/scores failed", e);
    return Response.json({ error: "登録できませんでした。時間をおいてもう一度試してください" }, { status: 500 });
  }
}
