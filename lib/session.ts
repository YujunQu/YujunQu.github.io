import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export type SessionRole = "ADMIN" | "VISITOR";

export type SessionPayload = JWTPayload & {
  userId: string;
  username: string;
  role: SessionRole;
};

export const SESSION_COOKIE_NAME = "flow_titration_session";

function getSessionSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

function shouldUseSecureCookies() {
  const override = process.env.COOKIE_SECURE;

  if (override === "true") {
    return true;
  }

  if (override === "false") {
    return false;
  }

  return process.env.NODE_ENV === "production" && process.env.APP_URL?.startsWith("https://");
}

export async function signSession(payload: Omit<SessionPayload, keyof JWTPayload>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSessionSecret());
}

export async function verifySession(token: string) {
  try {
    const verified = await jwtVerify<SessionPayload>(token, getSessionSecret());
    return verified.payload;
  } catch {
    return null;
  }
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySession(token);
}

export async function setSessionCookie(payload: Omit<SessionPayload, keyof JWTPayload>) {
  const cookieStore = await cookies();
  const token = await signSession(payload);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookies(),
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireSession() {
  const session = await getSessionFromCookies();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireAdminSession() {
  const session = await requireSession();

  if (session.role !== "ADMIN") {
    redirect("/forbidden");
  }

  return session;
}
