import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

function sanitizeBaseName(value: string) {
  return value.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-");
}

export function getUploadDirectory() {
  if (process.env.UPLOAD_DIR) {
    return path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.UPLOAD_DIR);
  }

  return path.join(process.cwd(), "storage", "uploads");
}

export async function ensureUploadDirectory() {
  await mkdir(getUploadDirectory(), { recursive: true });
}

export async function storeUploadedFile(file: File, prefix: string) {
  if (!file || file.size === 0) {
    return null;
  }

  await ensureUploadDirectory();

  const extension = path.extname(file.name) || ".bin";
  const fileName = `${sanitizeBaseName(prefix)}-${randomUUID()}${extension}`;
  const absolutePath = path.join(/* turbopackIgnore: true */ getUploadDirectory(), fileName);
  const bytes = Buffer.from(await file.arrayBuffer());

  await writeFile(absolutePath, bytes);

  return fileName;
}

export async function removeStoredFile(fileName: string | null | undefined) {
  if (!fileName) {
    return;
  }

  const absolutePath = path.join(/* turbopackIgnore: true */ getUploadDirectory(), fileName);
  await rm(absolutePath, { force: true });
}

export function getAbsoluteUploadPath(fileName: string) {
  return path.join(/* turbopackIgnore: true */ getUploadDirectory(), fileName);
}
