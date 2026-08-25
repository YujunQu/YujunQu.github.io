import { RecordsBrowser, type BrowserRecord } from "@/components/records-browser";
import { countRecords, listRecords } from "@/lib/records";

export const dynamic = "force-dynamic";

export default async function RecordsPage() {
  const [records, total] = await Promise.all([listRecords(), countRecords()]);

  const browserRecords: BrowserRecord[] = records.map((item) => ({
    id: item.id,
    species: item.species,
    sample: item.sample,
    target: item.target,
    dye: item.dye,
    clone: item.clone,
    productName: item.productName,
    catalogNo: item.catalogNo,
    concentration: item.concentration,
    vendor: item.vendor,
    vendorDose: item.vendorDose,
    system: item.system,
    stainCondition: item.stainCondition,
    optimalDose: item.optimalDose,
    minimumDose: item.minimumDose,
    titrationResult: item.titrationResult,
    imageUrl: item.imagePath ? `/api/uploads/${item.imagePath}` : null,
  }));

  return (
    <main className="page-main">
      <div className="section-header">
        <div className="result-badge">
          <strong>{total}</strong>
          <span>条记录</span>
        </div>
      </div>

      <RecordsBrowser records={browserRecords} />
    </main>
  );
}
