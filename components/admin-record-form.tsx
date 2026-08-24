import type { AntibodyRecord } from "@prisma/client";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  record?: AntibodyRecord | null;
};

function fieldValue(value: string | null | undefined) {
  return value ?? "";
}

export function AdminRecordForm({ action, submitLabel, record }: Props) {
  return (
    <form className="admin-form" action={action}>
      {record ? <input type="hidden" name="id" value={record.id} /> : null}

      <div className="admin-form-grid">
        <label className="field">
          <span>反应物种</span>
          <input name="species" defaultValue={fieldValue(record?.species)} required />
        </label>
        <label className="field">
          <span>样本</span>
          <input name="sample" defaultValue={fieldValue(record?.sample)} required />
        </label>
        <label className="field">
          <span>靶点</span>
          <input name="target" defaultValue={fieldValue(record?.target)} required />
        </label>
        <label className="field">
          <span>染料</span>
          <input name="dye" defaultValue={fieldValue(record?.dye)} required />
        </label>
        <label className="field">
          <span>克隆号</span>
          <input name="clone" defaultValue={fieldValue(record?.clone)} />
        </label>
        <label className="field">
          <span>货号</span>
          <input name="catalogNo" defaultValue={fieldValue(record?.catalogNo)} required />
        </label>
        <label className="field field-span-2">
          <span>产品名</span>
          <input name="productName" defaultValue={fieldValue(record?.productName)} required />
        </label>
        <label className="field">
          <span>浓度</span>
          <input name="concentration" defaultValue={fieldValue(record?.concentration)} />
        </label>
        <label className="field">
          <span>厂家</span>
          <input name="vendor" defaultValue={fieldValue(record?.vendor)} />
        </label>
        <label className="field">
          <span>厂家推荐用量</span>
          <input name="vendorDose" defaultValue={fieldValue(record?.vendorDose)} />
        </label>
        <label className="field">
          <span>体系</span>
          <input name="system" defaultValue={fieldValue(record?.system)} />
        </label>
        <label className="field">
          <span>染色条件</span>
          <input name="stainCondition" defaultValue={fieldValue(record?.stainCondition)} />
        </label>
        <label className="field">
          <span>最佳用量</span>
          <input name="optimalDose" defaultValue={fieldValue(record?.optimalDose)} />
        </label>
        <label className="field">
          <span>最低用量</span>
          <input name="minimumDose" defaultValue={fieldValue(record?.minimumDose)} />
        </label>
        <label className="field field-span-2">
          <span>滴定结果说明</span>
          <textarea name="titrationResult" defaultValue={fieldValue(record?.titrationResult)} rows={4} />
        </label>
        <label className="field field-span-2">
          <span>{record?.imagePath ? "替换滴定结果图" : "上传滴定结果图"}</span>
          <input name="image" type="file" accept="image/*" />
        </label>
      </div>

      {record?.imagePath ? (
        <div className="inline-image-preview">
          <p className="image-block-title">当前滴定结果图</p>
          <img src={`/api/uploads/${record.imagePath}`} alt={`${record.target} result`} />
        </div>
      ) : null}

      <div className="admin-form-actions">
        <button className="primary-button" type="submit">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
