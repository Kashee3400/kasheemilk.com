// app/api/careers/apply/route.ts
// ─── POST /api/careers/apply ──────────────────────────────────────────────────
// 1. Validates the payload
// 2. Checks the job exists and is still active
// 3. Inserts into job_applications (UNIQUE job_id + email enforced by DB)
// 4. Writes initial row to application_status_history
//
// Schema changes from original:
//   • current_role → current_job_role  (reserved word fix in consolidated schema)
//
// Tables: job_applications · application_status_history · job_openings

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { ApplicationSubmitResponse, JobApplicationInput } from "@/types/db";

// ── Validators ─────────────────────────────────────────────────────────────────
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v: string) => /^[+]?[\d\s\-()]{7,20}$/.test(v);
const isUrl   = (v: string) => { try { new URL(v); return true; } catch { return false; } };

interface FieldError { field: string; message: string; }

function validate(d: Partial<JobApplicationInput>): FieldError[] {
  const e: FieldError[] = [];

  if (!d.job_id?.trim())              e.push({ field: "job_id",      message: "Job ID is required." });
  if (!d.first_name?.trim())          e.push({ field: "first_name",  message: "First name is required." });
  if (!d.last_name?.trim())           e.push({ field: "last_name",   message: "Last name is required." });
  if (!d.email?.trim())               e.push({ field: "email",       message: "Email is required." });
  else if (!isEmail(d.email))         e.push({ field: "email",       message: "Please enter a valid email address." });
  if (!d.phone?.trim())               e.push({ field: "phone",       message: "Phone number is required." });
  else if (!isPhone(d.phone))         e.push({ field: "phone",       message: "Please enter a valid phone number." });
  if (d.total_experience_years == null)
    e.push({ field: "total_experience_years", message: "Years of experience is required." });
  if (!d.resume_url?.trim())          e.push({ field: "resume_url",  message: "Please provide your resume link." });
  if (d.linkedin_url  && !isUrl(d.linkedin_url))  e.push({ field: "linkedin_url",  message: "Please enter a valid LinkedIn URL." });
  if (d.portfolio_url && !isUrl(d.portfolio_url)) e.push({ field: "portfolio_url", message: "Please enter a valid portfolio URL." });
  if (d.github_url    && !isUrl(d.github_url))    e.push({ field: "github_url",    message: "Please enter a valid GitHub URL." });

  return e;
}

// ── Route handler ──────────────────────────────────────────────────────────────
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApplicationSubmitResponse | { errors: FieldError[] } | { error: string }>> {

  // ── 1. Parse body ────────────────────────────────────────────────────────
  let body: Partial<JobApplicationInput>;
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

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ── 3. Verify job exists and is still open ───────────────────────────
    const jobCheck = await client.query(
      `SELECT id, title
       FROM   job_openings
       WHERE  id = $1
         AND  is_active = TRUE
         AND  (application_deadline IS NULL OR application_deadline >= CURRENT_DATE)
       LIMIT  1`,
      [body.job_id]
    );

    if (!jobCheck.rowCount) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { errors: [{ field: "job_id", message: "This position is no longer accepting applications." }] },
        { status: 422 }
      );
    }

    // ── 4. Insert application ────────────────────────────────────────────
    // SCHEMA CHANGE: column renamed current_role → current_job_role
    // The UNIQUE (job_id, email) constraint handles duplicate attempts at DB level.
    let applicationId: string;
    try {
      const insert = await client.query(
        `INSERT INTO job_applications (
          job_id,
          first_name,             last_name,            email,              phone,
          current_job_role,       current_company,
          total_experience_years, notice_period_days,
          expected_salary,        salary_currency,
          resume_url,             linkedin_url,         portfolio_url,      github_url,
          cover_letter,           how_did_you_hear,
          willing_to_relocate,    available_from
        ) VALUES (
          $1,  $2,  $3,  $4,  $5,
          $6,  $7,  $8,  $9,
          $10, $11,
          $12, $13, $14, $15,
          $16, $17, $18, $19
        )
        RETURNING id`,
        [
          body.job_id,
          body.first_name,
          body.last_name,
          body.email!.toLowerCase().trim(),
          body.phone,
          body.current_job_role ?? null,   // ← was: body.current_role
          body.current_company  ?? null,
          body.total_experience_years,
          body.notice_period_days   ?? null,
          body.expected_salary      ?? null,
          body.salary_currency      ?? "INR",
          body.resume_url,
          body.linkedin_url         ?? null,
          body.portfolio_url        ?? null,
          body.github_url           ?? null,
          body.cover_letter         ?? null,
          body.how_did_you_hear     ?? null,
          body.willing_to_relocate  ?? null,
          body.available_from       ?? null,
        ]
      );
      applicationId = insert.rows[0].id as string;
    } catch (err: unknown) {
      await client.query("ROLLBACK");
      // PostgreSQL unique_violation = 23505
      if ((err as { code?: string }).code === "23505") {
        return NextResponse.json(
          { errors: [{ field: "email", message: "You have already applied for this position." }] },
          { status: 409 }
        );
      }
      throw err;
    }

    // ── 5. Seed first status history row ────────────────────────────────
    await client.query(
      `INSERT INTO application_status_history
         (application_id, from_status, to_status, changed_by, note)
       VALUES ($1, NULL, 'submitted', 'system', 'Application received via careers page')`,
      [applicationId]
    );

    await client.query("COMMIT");

    // ── 6. Respond ───────────────────────────────────────────────────────
    const shortRef = `APP-${applicationId.replace(/-/g, "").slice(-8).toUpperCase()}`;

    return NextResponse.json(
      {
        success: true,
        application_id: shortRef,
        message:
          "Your application has been submitted successfully. We will be in touch within 5 business days.",
      },
      { status: 201 }
    );

  } catch (err) {
    await client.query("ROLLBACK");
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/careers/apply]", message);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  } finally {
    client.release();
  }
}