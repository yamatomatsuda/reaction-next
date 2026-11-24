// ランキングの読み書き（SQL はここに集める）
import { db } from "./db";
import type { ValidScore } from "./score-rules";

export type RankingRow = { rank: number; name: string; avgMs: number; createdAt: Date };

// 「今日」は日本時間の0時から
const TODAY = `created_at >= (date_trunc('day', now() AT TIME ZONE 'Asia/Tokyo') AT TIME ZONE 'Asia/Tokyo')`;

async function top(where: string, limit: number): Promise<RankingRow[]> {
  const { rows } = await (await db()).query<{ rank: string; name: string; avg_ms: number; created_at: Date }>(
    `SELECT RANK() OVER (ORDER BY avg_ms) AS rank, name, avg_ms, created_at
       FROM scores ${where}
      ORDER BY avg_ms, created_at
      LIMIT $1`,
    [limit],
  );
  return rows.map((r) => ({ rank: Number(r.rank), name: r.name, avgMs: r.avg_ms, createdAt: r.created_at }));
}

export const getAllTimeTop = (limit = 20) => top("", limit);
export const getTodayTop = (limit = 10) => top(`WHERE ${TODAY}`, limit);

export async function insertScore(score: ValidScore): Promise<{ allTime: number; today: number }> {
  const pool = await db();
  await pool.query("INSERT INTO scores (name, avg_ms, times) VALUES ($1, $2, $3)", [score.name, score.avg, score.times]);
  // 自分より速い人の数 + 1 = 順位
  const { rows } = await pool.query<{ all_time: string; today: string }>(
    `SELECT COUNT(*) FILTER (WHERE avg_ms < $1) + 1 AS all_time,
            COUNT(*) FILTER (WHERE avg_ms < $1 AND ${TODAY}) + 1 AS today
       FROM scores`,
    [score.avg],
  );
  return { allTime: Number(rows[0].all_time), today: Number(rows[0].today) };
}
