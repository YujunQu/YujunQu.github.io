import { copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";

import XLSX from "xlsx";

import { prisma } from "../lib/prisma";
import { getUploadDirectory } from "../lib/uploads";
import { normalizeCellValue, normalizeImportedRecord, type ImportedRecord } from "../lib/import-normalization";

const excelPath = path.resolve(process.cwd(), "Flow titration data.xlsx");
const imageSourceDir = path.resolve(process.cwd(), "assets/flow-titration-images");

async function main() {
  const replaceExisting = process.argv.includes("--replace-existing");
  const existingCount = await prisma.antibodyRecord.count();

  if (existingCount > 0 && !replaceExisting) {
    throw new Error("数据库中已存在记录。若要覆盖导入，请追加 --replace-existing。");
  }

  if (replaceExisting) {
    await prisma.antibodyRecord.deleteMany();
  }

  const workbook = XLSX.readFile(excelPath, { cellDates: false });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: "" });
  const imageFiles = (await readdir(imageSourceDir))
    .filter((item) => item.startsWith("record-"))
    .sort((left, right) => left.localeCompare(right, "en"));

  await mkdir(getUploadDirectory(), { recursive: true });

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const normalized = normalizeImportedRecord({
      species: normalizeCellValue(row["反应物种"]),
      sample: normalizeCellValue(row["样本"]),
      target: normalizeCellValue(row["靶点"]),
      dye: normalizeCellValue(row["染料"]),
      clone: normalizeCellValue(row["克隆号"]),
      productName: normalizeCellValue(row["产品名"]),
      catalogNo: normalizeCellValue(row["货号"]),
      concentration: normalizeCellValue(row["浓度"]),
      vendor: normalizeCellValue(row["厂家"]),
      vendorDose: normalizeCellValue(row["厂家推荐用量"]),
      system: normalizeCellValue(row["体系"]),
      stainCondition: normalizeCellValue(row["染色条件"]),
      optimalDose: normalizeCellValue(row["最佳用量"]),
      minimumDose: normalizeCellValue(row["最低用量"]),
      titrationResult: normalizeCellValue(row["滴定结果"]),
    } satisfies ImportedRecord);

    let storedImageName: string | null = null;
    const sourceImage = imageFiles[index];
    if (sourceImage) {
      const sourcePath = path.join(imageSourceDir, sourceImage);
      storedImageName = `seed-${String(index + 1).padStart(2, "0")}${path.extname(sourceImage).toLowerCase()}`;
      await copyFile(sourcePath, path.join(getUploadDirectory(), storedImageName));
    }

    await prisma.antibodyRecord.create({
      data: {
        ...normalized,
        imagePath: storedImageName,
      },
    });
  }

  console.log(`Imported ${rows.length} records.`);
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
