import { UserRole } from "@prisma/client";

import { ensureAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createUserAction, resetPasswordAction } from "@/lib/server-actions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await ensureAdminUser();
  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
  });

  return (
    <main className="page-main">
      <div className="section-header">
        <div>
          <p className="panel-kicker">Admin Console</p>
          <h2>账号管理</h2>
        </div>
      </div>

      <section className="admin-panel user-management">
        <div className="user-creation-card">
          <h3>创建新账号</h3>
          <form className="admin-form" action={createUserAction}>
            <div className="admin-form-grid">
              <label className="field">
                <span>用户名</span>
                <input name="username" required />
              </label>
              <label className="field">
                <span>初始密码</span>
                <input name="password" type="password" required minLength={8} />
              </label>
              <label className="field">
                <span>角色</span>
                <select name="role" defaultValue={UserRole.VISITOR}>
                  <option value={UserRole.VISITOR}>访客</option>
                  <option value={UserRole.ADMIN}>管理员</option>
                </select>
              </label>
            </div>
            <div className="admin-form-actions">
              <button className="primary-button" type="submit">
                创建账号
              </button>
            </div>
          </form>
        </div>

        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>用户名</th>
                <th>角色</th>
                <th>状态</th>
                <th>创建时间</th>
                <th>重置密码</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.role === "ADMIN" ? "管理员" : "访客"}</td>
                  <td>{user.status === "ACTIVE" ? "启用" : "停用"}</td>
                  <td>{new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short" }).format(user.createdAt)}</td>
                  <td>
                    <form className="inline-reset-form" action={resetPasswordAction}>
                      <input type="hidden" name="userId" value={user.id} />
                      <input name="password" type="password" minLength={8} placeholder="新密码" required />
                      <button type="submit" className="secondary-button">
                        重置
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
