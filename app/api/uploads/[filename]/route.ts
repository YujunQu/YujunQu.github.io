import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";

import { NextResponse, type NextRequest } from "next/server";
import mime from "mime";

import { getAbsoluteUploadPath } from "@/lib/uploads";

export async function GET(_: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const absolutePath = getAbsoluteUploadPath(filename);

  try {
    await stat(absolutePath);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const stream = createReadStream(absolutePath);

  return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
    headers: {
      "Content-Type": mime.getType(filename) || "application/octet-stream",
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
