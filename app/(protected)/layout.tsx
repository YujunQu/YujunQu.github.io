import Link from "next/link";

import { LogoutButton } from "@/components/logout-button";
import { getCurrentUser } from "@/lib/auth";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="shell">
      <header className="shell-header">
        <div>
          <p className="page-kicker">Flow Cytometry Portal</p>
          <h1>流式滴定数据平台</h1>
        </div>

        <div className="shell-actions">
          <nav className="shell-nav">
            <Link href="/">数据查询</Link>
            {user.role === "ADMIN" ? <Link href="/admin/records">记录管理</Link> : null}
            {user.role === "ADMIN" ? <Link href="/admin/users">账号管理</Link> : null}
          </nav>

          <div className="user-pill">
            <span>{user.username}</span>
            <span className="user-role">{user.role === "ADMIN" ? "管理员" : "访客"}</span>
          </div>

          <LogoutButton />
        </div>
      </header>

      <div className="shell-body">{children}</div>
    </div>
  );
}
