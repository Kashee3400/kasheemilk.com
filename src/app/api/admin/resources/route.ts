import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin/auth";
import { createResourceRow, getAdminModuleData, updateResourceRow } from "@/lib/admin/resources";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  if (!getAdminUser()) return unauthorized();

  const moduleId = request.nextUrl.searchParams.get("module");
  if (!moduleId) {
    return NextResponse.json({ error: "Module is required." }, { status: 422 });
  }

  try {
    const data = await getAdminModuleData(moduleId);
    if (!data) return NextResponse.json({ error: "Unknown module." }, { status: 404 });
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/admin/resources]", error);
    return NextResponse.json({ error: "Failed to load admin resource." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!getAdminUser()) return unauthorized();

  try {
    const body = await request.json() as { resource?: string; values?: Record<string, unknown> };
    if (!body.resource || !body.values) {
      return NextResponse.json({ error: "Resource and values are required." }, { status: 422 });
    }
    await createResourceRow(body.resource, body.values);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create row.";
    console.error("[POST /api/admin/resources]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!getAdminUser()) return unauthorized();

  try {
    const body = await request.json() as {
      resource?: string;
      id?: string | number;
      values?: Record<string, unknown>;
    };
    if (!body.resource || body.id == null || !body.values) {
      return NextResponse.json({ error: "Resource, id, and values are required." }, { status: 422 });
    }
    await updateResourceRow(body.resource, body.id, body.values);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update row.";
    console.error("[PATCH /api/admin/resources]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
