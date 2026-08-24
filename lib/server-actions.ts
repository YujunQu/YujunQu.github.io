"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { ensureAdminUser, hashPassword, loginUser, logoutUser } from "./auth";
import { prisma } from "./prisma";
import { listRecords } from "./records";
import { removeStoredFile, storeUploadedFile } from "./uploads";
import { createUserSchema, loginSchema, recordSchema, resetPasswordSchema } from "./validators";

export type LoginActionState = {
  error: string | null;
};

export async function loginAction(_: LoginActionState, formData: FormData): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "登录信息不完整" };
  }

  const user = await loginUser(parsed.data.username, parsed.data.password);
  if (!user) {
    return { error: "用户名或密码错误，或账号已停用" };
  }

  redirect("/");
}

export async function logoutAction() {
  await logoutUser();
  redirect("/login");
}

function getOptionalString(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").trim();
  return raw || undefined;
}

export async function createRecordAction(formData: FormData) {
  await ensureAdminUser();

  const parsed = recordSchema.safeParse({
    species: formData.get("species"),
    sample: formData.get("sample"),
    target: formData.get("target"),
    dye: formData.get("dye"),
    clone: getOptionalString(formData, "clone"),
    productName: formData.get("productName"),
    catalogNo: formData.get("catalogNo"),
    concentration: getOptionalString(formData, "concentration"),
    vendor: getOptionalString(formData, "vendor"),
    vendorDose: getOptionalString(formData, "vendorDose"),
    system: getOptionalString(formData, "system"),
    stainCondition: getOptionalString(formData, "stainCondition"),
    optimalDose: getOptionalString(formData, "optimalDose"),
    minimumDose: getOptionalString(formData, "minimumDose"),
    titrationResult: getOptionalString(formData, "titrationResult"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "记录校验失败");
  }

  const image = formData.get("image");
  const imagePath =
    image instanceof File && image.size > 0
      ? await storeUploadedFile(image, `${parsed.data.target}-${parsed.data.species}`)
      : null;

  await prisma.antibodyRecord.create({
    data: {
      ...parsed.data,
      imagePath,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/records");
  redirect("/admin/records");
}

export async function updateRecordAction(formData: FormData) {
  await ensureAdminUser();

  const id = String(formData.get("id") ?? "");
  const existing = await prisma.antibodyRecord.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("未找到要更新的记录");
  }

  const parsed = recordSchema.safeParse({
    species: formData.get("species"),
    sample: formData.get("sample"),
    target: formData.get("target"),
    dye: formData.get("dye"),
    clone: getOptionalString(formData, "clone"),
    productName: formData.get("productName"),
    catalogNo: formData.get("catalogNo"),
    concentration: getOptionalString(formData, "concentration"),
    vendor: getOptionalString(formData, "vendor"),
    vendorDose: getOptionalString(formData, "vendorDose"),
    system: getOptionalString(formData, "system"),
    stainCondition: getOptionalString(formData, "stainCondition"),
    optimalDose: getOptionalString(formData, "optimalDose"),
    minimumDose: getOptionalString(formData, "minimumDose"),
    titrationResult: getOptionalString(formData, "titrationResult"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "记录校验失败");
  }

  const image = formData.get("image");
  let imagePath = existing.imagePath;

  if (image instanceof File && image.size > 0) {
    const nextImagePath = await storeUploadedFile(image, `${parsed.data.target}-${parsed.data.species}`);
    await removeStoredFile(existing.imagePath);
    imagePath = nextImagePath;
  }

  await prisma.antibodyRecord.update({
    where: { id },
    data: {
      ...parsed.data,
      imagePath,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/records");
  redirect("/admin/records");
}

export async function deleteRecordAction(formData: FormData) {
  await ensureAdminUser();
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.antibodyRecord.findUnique({ where: { id } });

  if (existing) {
    await prisma.antibodyRecord.delete({ where: { id } });
    await removeStoredFile(existing.imagePath);
  }

  revalidatePath("/");
  revalidatePath("/admin/records");
}

export async function createUserAction(formData: FormData) {
  await ensureAdminUser();

  const parsed = createUserSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "账号校验失败");
  }

  const existing = await prisma.user.findUnique({
    where: { username: parsed.data.username },
  });

  if (existing) {
    throw new Error("用户名已存在");
  }

  await prisma.user.create({
    data: {
      username: parsed.data.username,
      passwordHash: await hashPassword(parsed.data.password),
      role: parsed.data.role === "ADMIN" ? UserRole.ADMIN : UserRole.VISITOR,
    },
  });

  revalidatePath("/admin/users");
}

export async function resetPasswordAction(formData: FormData) {
  await ensureAdminUser();

  const parsed = resetPasswordSchema.safeParse({
    userId: formData.get("userId"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "密码校验失败");
  }

  await prisma.user.update({
    where: { id: parsed.data.userId },
    data: {
      passwordHash: await hashPassword(parsed.data.password),
    },
  });

  revalidatePath("/admin/users");
}

export async function countImportedRecordsAction() {
  return listRecords();
}
