import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="panel-kicker">Secure Access</p>
        <h1>登录流式滴定数据平台</h1>
        <p className="auth-text">
          该网站现在需要登录后访问。管理员可管理账号与滴定记录，访客账号仅可浏览和查询内容。
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
