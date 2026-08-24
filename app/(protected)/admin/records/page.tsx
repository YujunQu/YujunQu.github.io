import Link from "next/link";

import { deleteRecordAction } from "@/lib/server-actions";
import { ensureAdminUser } from "@/lib/auth";
import { listRecords } from "@/lib/records";

export const dynamic = "force-dynamic";

export default async function AdminRecordsPage() {
  await ensureAdminUser();
  const records = await listRecords();

  return (
    <main className="page-main">
      <div className="section-header">
        <div>
          <p className="panel-kicker">Admin Console</p>
          <h2>滴定记录管理</h2>
        </div>
        <Link className="primary-button" href="/admin/records/new">
          新增记录
        </Link>
      </div>

      <section className="admin-panel">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>靶点</th>
                <th>反应物种</th>
                <th>染料</th>
                <th>货号</th>
                <th>图片</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{record.target}</td>
                  <td>{record.species}</td>
                  <td>{record.dye}</td>
                  <td>{record.catalogNo}</td>
                  <td>{record.imagePath ? "已上传" : "无"}</td>
                  <td className="table-actions">
                    <Link href={`/admin/records/${record.id}/edit`}>编辑</Link>
                    <form action={deleteRecordAction}>
                      <input type="hidden" name="id" value={record.id} />
                      <button type="submit" className="link-button danger-button">
                        删除
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
