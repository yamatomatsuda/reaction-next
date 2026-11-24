import { ReactionGame } from "@/components/ReactionGame";

// ページ自体はサーバーで組み立て、遊ぶ部分（ReactionGame）だけをブラウザで動かす
export default function Home() {
  return (
    <main className="mx-auto flex h-dvh w-full max-w-md flex-col gap-3 pb-[calc(env(safe-area-inset-bottom)+12px)] pl-[max(16px,env(safe-area-inset-left))] pr-[max(16px,env(safe-area-inset-right))] pt-[calc(env(safe-area-inset-top)+12px)]">
      <ReactionGame />
      <footer className="text-center text-xs text-muted">
        赤のうちにタップするとフライング。一般的な平均は 250ms 前後です。
      </footer>
    </main>
  );
}
