import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

// 数字用のフォント（日本語は端末のフォントを使う）
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "反射神経テスト",
  description: "画面が緑になった瞬間にタップして反応速度を測るミニゲーム",
  appleWebApp: { capable: true, title: "反射テスト", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#2f5bd3",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full overscroll-none">{children}</body>
    </html>
  );
}
