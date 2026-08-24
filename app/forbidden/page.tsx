import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="panel-kicker">Access Restricted</p>
        <h1>没有权限访问该页面</h1>
        <p className="auth-text">你当前的账号没有管理员权限。如需操作后台，请联系管理员。</p>
        <Link className="primary-button" href="/">
          返回查询页
        </Link>
      </section>
    </main>
  );
}
