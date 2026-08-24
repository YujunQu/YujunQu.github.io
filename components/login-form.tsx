"use client";

import { useActionState } from "react";

import { loginAction, type LoginActionState } from "@/lib/server-actions";

const initialState: LoginActionState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form className="auth-form" action={formAction}>
      <label className="field">
        <span>用户名</span>
        <input name="username" type="text" autoComplete="username" required />
      </label>

      <label className="field">
        <span>密码</span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>

      {state.error ? <p className="form-error">{state.error}</p> : null}

      <button className="primary-button" type="submit" disabled={pending}>
        {pending ? "登录中..." : "登录"}
      </button>
    </form>
  );
}
