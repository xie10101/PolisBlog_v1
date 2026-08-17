import type { Metadata } from "next";
import { APP_NAME } from "@polisblog/shared";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "全栈个人博客 + 个人知识库",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
