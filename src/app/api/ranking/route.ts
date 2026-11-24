// GET /api/ranking … スマホアプリなど、外から使うためのランキング取得API
import { getAllTimeTop, getTodayTop } from "@/lib/ranking";

export async function GET() {
  try {
    const [today, allTime] = await Promise.all([getTodayTop(), getAllTimeTop()]);
    return Response.json({ today, allTime }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("GET /api/ranking failed", e);
    return Response.json({ error: "ランキングを読み込めませんでした" }, { status: 500 });
  }
}
