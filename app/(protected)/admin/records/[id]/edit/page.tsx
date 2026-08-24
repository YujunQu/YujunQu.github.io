import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminRecordForm } from "@/components/admin-record-form";
import { ensureAdminUser } from "@/lib/auth";
import { getRecordById } from "@/lib/records";
import { updateRecordAction } from "@/lib/server-actions";

export default async function EditRecordPage({ params }: { params: Promise<{ id: string }> }) {
  await ensureAdminUser();
  const { id } = await params;
  const record = await getRecordById(id);

  if (!record) {
    notFound();
  }

  return (
    <main className="page-main">
      <div className="section-header">
        <div>
          <p className="panel-kicker">Admin Console</p>
          <h2>编辑滴定记录</h2>
        </div>
        <Link className="secondary-button" href="/admin/records">
          返回列表
        </Link>
      </div>

      <section className="admin-panel">
        <AdminRecordForm action={updateRecordAction} submitLabel="更新记录" record={record} />
      </section>
    </main>
  );
}
