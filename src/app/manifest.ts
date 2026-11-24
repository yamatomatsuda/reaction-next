import type { MetadataRoute } from "next";

// ホーム画面に追加したときの設定（Next.js が /manifest.webmanifest として配信する）
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "反射神経テスト",
    short_name: "反射テスト",
    description: "画面が緑になった瞬間にタップして反応速度を測るミニゲーム",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#2f5bd3",
    theme_color: "#2f5bd3",
    lang: "ja",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
