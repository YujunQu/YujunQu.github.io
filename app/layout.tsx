import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Flow Titration Portal",
  description: "受保护的抗体滴定数据查询与管理系统",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
