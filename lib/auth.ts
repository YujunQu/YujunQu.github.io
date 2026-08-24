import bcrypt from "bcryptjs";
import { UserStatus } from "@prisma/client";
import { redirect } from "next/navigation";

import { prisma } from "./prisma";
import { clearSessionCookie, getSessionFromCookies, requireAdminSession, setSessionCookie } from "./session";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function authenticateUser(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user || user.status !== UserStatus.ACTIVE) {
    return null;
  }

  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    return null;
  }

  return user;
}

export async function loginUser(username: string, password: string) {
  const user = await authenticateUser(username, password);

  if (!user) {
    return null;
  }

  await setSessionCookie({
    userId: user.id,
    username: user.username,
    role: user.role,
  });

  return user;
}

export async function logoutUser() {
  await clearSessionCookie();
}

export async function getCurrentUser() {
  const session = await getSessionFromCookies();

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user || user.status !== UserStatus.ACTIVE) {
    await clearSessionCookie();
    return null;
  }

  return user;
}

export async function getRequiredUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function ensureAdminUser() {
  await requireAdminSession();

  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authenticated admin user could not be loaded.");
  }

  return user;
}
