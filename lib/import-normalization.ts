export type ImportedRecord = {
  species: string;
  sample: string;
  target: string;
  dye: string;
  clone: string;
  productName: string;
  catalogNo: string;
  concentration: string;
  vendor: string;
  vendorDose: string;
  system: string;
  stainCondition: string;
  optimalDose: string;
  minimumDose: string;
  titrationResult: string;
};

const DYE_MAP: Record<string, string> = {
  "APC-cy7": "APC-Cy7",
  "APC/Cyanine7": "APC-Cy7",
  "PE/Cyanine7": "PE-Cy7",
  "PE/Cy7": "PE-Cy7",
  "PE/Cyanine5": "PE-Cy5",
  "PE/Cy5": "PE-Cy5",
  "PerCP/Cyanine5.5": "PerCP-Cy5.5",
  "Alexa Fluor® 700": "AF700",
  Ef450: "eFluor 450",
  CAF700: "AF700",
};

const VENDOR_MAP: Record<string, string> = {
  biolegend: "BioLegend",
  Biolegend: "BioLegend",
  selleck: "Selleck",
};

export function normalizeCellValue(value: unknown) {
  return String(value ?? "")
    .replace(/\t/g, " ")
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/ *\n */g, " / ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeImportedRecord(input: ImportedRecord): ImportedRecord {
  const clone = input.clone.startsWith("/") ? input.clone.replace(/^\/+\s*/, "") : input.clone;
  const concentration = input.concentration.startsWith("/")
    ? input.concentration.replace(/^\/+\s*/, "")
    : input.concentration;
  const vendor = VENDOR_MAP[input.vendor] ?? input.vendor;

  return {
    ...input,
    dye: DYE_MAP[input.dye] ?? input.dye,
    clone,
    concentration,
    vendor,
    vendorDose: input.vendorDose.toLowerCase() === vendor.toLowerCase() ? "" : input.vendorDose,
  };
}
