import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "请输入用户名"),
  password: z.string().min(1, "请输入密码"),
});

export const recordSchema = z.object({
  species: z.string().trim().min(1, "请输入反应物种"),
  sample: z.string().trim().min(1, "请输入样本"),
  target: z.string().trim().min(1, "请输入靶点"),
  dye: z.string().trim().min(1, "请输入染料"),
  clone: z.string().trim().optional(),
  productName: z.string().trim().min(1, "请输入产品名"),
  catalogNo: z.string().trim().min(1, "请输入货号"),
  concentration: z.string().trim().optional(),
  vendor: z.string().trim().optional(),
  vendorDose: z.string().trim().optional(),
  system: z.string().trim().optional(),
  stainCondition: z.string().trim().optional(),
  optimalDose: z.string().trim().optional(),
  minimumDose: z.string().trim().optional(),
  titrationResult: z.string().trim().optional(),
});

export const createUserSchema = z.object({
  username: z.string().trim().min(3, "用户名至少 3 个字符"),
  password: z.string().min(8, "密码至少 8 个字符"),
  role: z.enum(["ADMIN", "VISITOR"]),
});

export const resetPasswordSchema = z.object({
  userId: z.string().trim().min(1),
  password: z.string().min(8, "密码至少 8 个字符"),
});
