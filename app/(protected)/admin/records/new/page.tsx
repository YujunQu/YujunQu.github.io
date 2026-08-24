import Link from "next/link";

import { AdminRecordForm } from "@/components/admin-record-form";
import { ensureAdminUser } from "@/lib/auth";
import { createRecordAction } from "@/lib/server-actions";

export default async function NewRecordPage() {
  await ensureAdminUser();

  return (
    <main className="page-main">
      <div className="section-header">
        <div>
          <p className="panel-kicker">Admin Console</p>
          <h2>新增滴定记录</h2>
        </div>
        <Link className="secondary-button" href="/admin/records">
          返回列表
        </Link>
      </div>

      <section className="admin-panel">
        <AdminRecordForm action={createRecordAction} submitLabel="保存记录" />
      </section>
    </main>
  );
}
