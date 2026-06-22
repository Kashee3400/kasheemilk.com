// app/api/contact/submit/route.ts
// ─── POST /api/contact/submit ─────────────────────────────────────────────────
// Validates → inserts into contact_submissions.
//
// Schema notes (consolidated v1.0):
//   • contact_submissions table is unchanged — no migration needed here.
//   • ContactSubmissionInput lives in @/types/db — imported directly.
//   • ContactSubmitResponse defined locally (no shared type exists).
//
// Table: contact_submissions

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import type { ContactSubmissionInput } from "@/types/db";

// ── Local response type ────────────────────────────────────────────────────────
interface ContactSubmitResponse {
  success:       boolean;
  submission_id: string;   // short ref e.g. "MSG-A1B2C3D4"
  message:       string;
}

interface FieldError {
  field:   string;
  message: string;
}

// ── Validators ─────────────────────────────────────────────────────────────────
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v: string) => /^[+]?[\d\s\-()]{7,20}$/.test(v);

const VALID_SUBJECTS = [
  "general", "product_query", "complaint",
  "partnership", "media", "careers", "other",
] as const;

function validate(d: Partial<ContactSubmissionInput>): FieldError[] {
  const e: FieldError[] = [];

  if (!d.full_name?.trim())
    e.push({ field: "full_name", message: "Full name is required." });
  if (!d.email?.trim())
    e.push({ field: "email", message: "Email address is required." });
  else if (!isEmail(d.email))
    e.push({ field: "email", message: "Please enter a valid email address." });
  if (d.phone && !isPhone(d.phone))
    e.push({ field: "phone", message: "Please enter a valid phone number." });
  if (!d.subject || !VALID_SUBJECTS.includes(d.subject as typeof VALID_SUBJECTS[number]))
    e.push({ field: "subject", message: "Please select a subject." });
  if (!d.message?.trim())
    e.push({ field: "message", message: "Message cannot be empty." });
  else if (d.message.trim().length < 10)
    e.push({ field: "message", message: "Message must be at least 10 characters." });

  return e;
}

// ── Route handler ──────────────────────────────────────────────────────────────
export async function POST(
  request: NextRequest
): Promise<NextResponse<ContactSubmitResponse | { errors: FieldError[] } | { error: string }>> {

  // ── 1. Parse body ────────────────────────────────────────────────────────
  let body: Partial<ContactSubmissionInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // ── 2. Validate ──────────────────────────────────────────────────────────
  const errors = validate(body);
  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  // ── 3. Extract request metadata for audit ────────────────────────────────
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim()
          ?? request.headers.get("x-real-ip")
          ?? null;
  const ua = request.headers.get("user-agent") ?? null;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const insert = await client.query(
      `INSERT INTO contact_submissions (
        full_name, email, phone, subject, message,
        office_id, newsletter_opt_in,
        ip_address, user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id`,
      [
        body.full_name!.trim(),
        body.email!.toLowerCase().trim(),
        body.phone?.trim()       || null,
        body.subject,
        body.message!.trim(),
        body.office_id           || null,
        body.newsletter_opt_in   ?? false,
        ip,
        ua,
      ]
    );

    await client.query("COMMIT");

    const id       = insert.rows[0].id as string;
    const shortRef = `MSG-${id.replace(/-/g, "").slice(-8).toUpperCase()}`;

    return NextResponse.json(
      {
        success:       true,
        submission_id: shortRef,
        message:       "Your message has been received. We will get back to you within one business day.",
      },
      { status: 201 }
    );
  } catch (err) {
    await client.query("ROLLBACK");
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[POST /api/contact/submit]", message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  } finally {
    client.release();
  }
}