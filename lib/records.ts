import { prisma } from "./prisma";

export type RecordListItem = Awaited<ReturnType<typeof listRecords>>[number];

export async function listRecords() {
  return prisma.antibodyRecord.findMany({
    orderBy: [{ createdAt: "asc" }, { target: "asc" }],
  });
}

export async function getRecordById(id: string) {
  return prisma.antibodyRecord.findUnique({
    where: { id },
  });
}

export async function countRecords() {
  return prisma.antibodyRecord.count();
}
