import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export type AdminUser = {
  email: string;
  name: string;
  role: "super_admin";
};

const COOKIE_NAME = "kashee_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.REVALIDATE_SECRET || "dev-admin-session-secret";
}

function getAdminEmail() {
  return process.env.ADMIN_EMAIL || "admin@kasheemilk.com";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function verifyAdminCredentials(email: string, password: string) {
  return safeEqual(email.trim().toLowerCase(), getAdminEmail().toLowerCase()) &&
    safeEqual(password, getAdminPassword());
}

export function createAdminSession(email: string) {
  const payload = JSON.stringify({
    email: email.trim().toLowerCase(),
    name: "Kashee Admin",
    role: "super_admin",
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS,
  });
  const encodedPayload = Buffer.from(payload).toString("base64url");
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function setAdminSession(email: string) {
  cookies().set(COOKIE_NAME, createAdminSession(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  });
}

export function clearAdminSession() {
  cookies().set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export function getAdminUser(): AdminUser | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature || !safeEqual(signature, sign(encodedPayload))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as AdminUser & {
      exp: number;
    };

    if (!payload.email || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      email: payload.email,
      name: payload.name || "Kashee Admin",
      role: "super_admin",
    };
  } catch {
    return null;
  }
}

export function requireAdminUser() {
  const user = getAdminUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
