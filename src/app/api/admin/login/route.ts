import { NextRequest, NextResponse } from "next/server";
import { setAdminSession, verifyAdminCredentials } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = body.email?.trim() || "";
  const password = body.password || "";

  if (!verifyAdminCredentials(email, password)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  setAdminSession(email);
  return NextResponse.json({ success: true });
}
