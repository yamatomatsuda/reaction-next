// データベース（PostgreSQL）への接続。サーバー側でだけ使う。
import { Pool } from "pg";

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS scores (
    id         SERIAL PRIMARY KEY,
    name       TEXT        NOT NULL,
    avg_ms     INTEGER     NOT NULL,
    times      INTEGER[]   NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS scores_avg_idx ON scores (avg_ms);
  CREATE INDEX IF NOT EXISTS scores_created_idx ON scores (created_at);
`;

// 開発中はファイル保存のたびにコードが読み直されるので、接続は使い回す
const g = globalThis as unknown as { pgPool?: Pool; pgReady?: Promise<void> };

function pool(): Pool {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL が設定されていません");
  g.pgPool ??= new Pool({ connectionString: url, max: 3 });
  return g.pgPool;
}

// 初回だけテーブルを作ってから使う
export async function db(): Promise<Pool> {
  const p = pool();
  g.pgReady ??= p.query(SCHEMA).then(() => undefined);
  try {
    await g.pgReady;
  } catch (e) {
    g.pgReady = undefined;
    throw e;
  }
  return p;
}
