import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="panel-kicker">Secure Access</p>
        <h1>登录流式滴定数据平台</h1>
        <LoginForm />
      </section>
    </main>
  );
}
