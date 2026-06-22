import { revalidatePath, revalidateTag } from "next/cache";
import pool from "@/lib/db";

export type AdminFieldKind = "text" | "textarea" | "number" | "boolean" | "date" | "select" | "csv" | "readonly";

export type AdminField = {
  key: string;
  label: string;
  kind?: AdminFieldKind;
  required?: boolean;
  options?: { label: string; value: string }[];
  create?: boolean;
};

export type AdminResource = {
  id: string;
  title: string;
  table: string;
  primaryKey: string;
  orderBy: string;
  fields: AdminField[];
  createFields?: string[];
  revalidate?: string[];
};

export type AdminModule = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  resources: string[];
};

const yesNo = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

const activeField = { key: "is_active", label: "Active", kind: "boolean" as const };
const sortField = { key: "sort_order", label: "Sort Order", kind: "number" as const };

export const resources: Record<string, AdminResource> = {
  site_config: {
    id: "site_config",
    title: "Site Config",
    table: "site_config",
    primaryKey: "id",
    orderBy: "category ASC, key ASC",
    revalidate: ["header", "footer", "about", "stats", "hero", "path:/"],
    fields: [
      { key: "id", label: "ID", kind: "readonly" },
      { key: "category", label: "Category", kind: "readonly" },
      { key: "key", label: "Key", kind: "readonly" },
      { key: "label", label: "Label" },
      { key: "value", label: "Value", kind: "textarea" },
      { key: "value_type", label: "Type", kind: "readonly" },
      { key: "is_public", label: "Public", kind: "boolean" },
    ],
  },
  page_heroes: {
    id: "page_heroes",
    title: "Page Heroes",
    table: "page_heroes",
    primaryKey: "id",
    orderBy: "page ASC, updated_at DESC",
    revalidate: ["path:/about-us", "path:/contact-us", "path:/join-us", "path:/board-of-directors"],
    createFields: ["page", "label", "headline", "subheadline"],
    fields: [
      { key: "id", label: "ID", kind: "readonly" },
      { key: "page", label: "Page", required: true },
      { key: "label", label: "Label" },
      { key: "headline", label: "Headline", required: true },
      { key: "subheadline", label: "Subheadline", kind: "textarea", required: true },
      { key: "description", label: "Description", kind: "textarea" },
      { key: "cta_label", label: "CTA Label" },
      { key: "cta_href", label: "CTA Link" },
      { key: "banner_image_url", label: "Banner Image URL" },
      activeField,
    ],
  },
  page_stats: {
    id: "page_stats",
    title: "Stats",
    table: "page_stats",
    primaryKey: "id",
    orderBy: "section ASC, sort_order ASC",
    revalidate: ["stats", "footer", "path:/join-us"],
    createFields: ["section", "stat_key", "display_value", "label"],
    fields: [
      { key: "id", label: "ID", kind: "readonly" },
      { key: "section", label: "Section", kind: "select", options: ["home", "footer", "careers"].map(value => ({ label: value, value })) },
      { key: "stat_key", label: "Key", required: true },
      { key: "display_value", label: "Display Value", required: true },
      { key: "numeric_value", label: "Numeric Value", kind: "number" },
      { key: "suffix", label: "Suffix" },
      { key: "label", label: "Label", required: true },
      { key: "icon", label: "Icon" },
      sortField,
      activeField,
    ],
  },
  about_paragraphs: {
    id: "about_paragraphs",
    title: "About Paragraphs",
    table: "about_paragraphs",
    primaryKey: "id",
    orderBy: "sort_order ASC",
    revalidate: ["about", "path:/about-us"],
    createFields: ["content"],
    fields: [
      { key: "id", label: "ID", kind: "readonly" },
      { key: "content", label: "Content", kind: "textarea", required: true },
      sortField,
      activeField,
    ],
  },
  about_districts: {
    id: "about_districts",
    title: "Districts",
    table: "about_districts",
    primaryKey: "id",
    orderBy: "sort_order ASC",
    revalidate: ["about"],
    createFields: ["name"],
    fields: [
      { key: "id", label: "ID", kind: "readonly" },
      { key: "name", label: "Name", required: true },
      { key: "href", label: "Link" },
      sortField,
      activeField,
    ],
  },
  about_sdg_badges: {
    id: "about_sdg_badges",
    title: "SDG Badges",
    table: "about_sdg_badges",
    primaryKey: "id",
    orderBy: "sort_order ASC",
    revalidate: ["about"],
    createFields: ["image_url", "label"],
    fields: [
      { key: "id", label: "ID", kind: "readonly" },
      { key: "image_url", label: "Image URL", required: true },
      { key: "label", label: "Label", required: true },
      { key: "href", label: "Link" },
      sortField,
      activeField,
    ],
  },
  about_news_items: {
    id: "about_news_items",
    title: "News Items",
    table: "about_news_items",
    primaryKey: "id",
    orderBy: "sort_order ASC",
    revalidate: ["about"],
    createFields: ["title", "image_url", "href"],
    fields: [
      { key: "id", label: "ID", kind: "readonly" },
      { key: "title", label: "Title", required: true },
      { key: "image_url", label: "Image URL", required: true },
      { key: "href", label: "Link", required: true },
      { key: "source", label: "Source" },
      { key: "published_at", label: "Published Date", kind: "date" },
      sortField,
      activeField,
    ],
  },
  gallery_items: {
    id: "gallery_items",
    title: "Gallery Items",
    table: "gallery_items",
    primaryKey: "id",
    orderBy: "featured DESC, sort_order ASC, shot_date DESC NULLS LAST",
    revalidate: ["gallery", "path:/gallery", "path:/"],
    createFields: ["image_url", "alt_text", "category"],
    fields: [
      { key: "id", label: "ID", kind: "readonly" },
      { key: "image_url", label: "Image URL", required: true },
      { key: "thumbnail_url", label: "Thumbnail URL" },
      { key: "alt_text", label: "Alt Text", required: true },
      { key: "title", label: "Title" },
      { key: "description", label: "Description", kind: "textarea" },
      { key: "category", label: "Category", kind: "select", options: ["events", "milestones", "team", "products", "community"].map(value => ({ label: value, value })) },
      { key: "tags", label: "Tags", kind: "csv" },
      { key: "aspect_ratio", label: "Aspect", kind: "select", options: ["square", "landscape", "portrait"].map(value => ({ label: value, value })) },
      { key: "featured", label: "Featured", kind: "boolean" },
      sortField,
      activeField,
      { key: "shot_date", label: "Shot Date", kind: "date" },
    ],
  },
  bod_members: {
    id: "bod_members",
    title: "Board Members",
    table: "bod_members",
    primaryKey: "id",
    orderBy: "is_chairman DESC, sort_order ASC",
    revalidate: ["path:/board-of-directors"],
    createFields: ["full_name", "designation"],
    fields: [
      { key: "id", label: "ID", kind: "readonly" },
      { key: "full_name", label: "Full Name", required: true },
      { key: "role_id", label: "Role ID", kind: "number" },
      { key: "designation", label: "Designation", required: true },
      { key: "photo_url", label: "Photo URL" },
      { key: "bio", label: "Bio", kind: "textarea" },
      { key: "qualification", label: "Qualification" },
      { key: "district", label: "District" },
      { key: "appointed_on", label: "Appointed On", kind: "date" },
      { key: "linkedin_url", label: "LinkedIn URL" },
      sortField,
      { key: "is_chairman", label: "Chairman", kind: "boolean" },
      activeField,
    ],
  },
  bod_roles: {
    id: "bod_roles",
    title: "Board Roles",
    table: "bod_roles",
    primaryKey: "id",
    orderBy: "sort_order ASC",
    revalidate: ["path:/board-of-directors"],
    createFields: ["role_key", "role_label"],
    fields: [
      { key: "id", label: "ID", kind: "readonly" },
      { key: "role_key", label: "Role Key", required: true },
      { key: "role_label", label: "Role Label", required: true },
      sortField,
    ],
  },
  departments: {
    id: "departments",
    title: "Departments",
    table: "departments",
    primaryKey: "id",
    orderBy: "name ASC",
    revalidate: ["path:/join-us"],
    createFields: ["name", "slug"],
    fields: [
      { key: "id", label: "ID", kind: "readonly" },
      { key: "name", label: "Name", required: true },
      { key: "slug", label: "Slug", required: true },
      { key: "description", label: "Description", kind: "textarea" },
      { key: "head_count", label: "Head Count", kind: "number" },
      activeField,
    ],
  },
  job_openings: {
    id: "job_openings",
    title: "Job Openings",
    table: "job_openings",
    primaryKey: "id",
    orderBy: "is_featured DESC, posted_at DESC",
    revalidate: ["path:/join-us"],
    createFields: ["title", "slug", "department_id", "employment_type", "experience_level", "work_mode", "location", "summary", "description"],
    fields: [
      { key: "id", label: "ID", kind: "readonly" },
      { key: "title", label: "Title", required: true },
      { key: "slug", label: "Slug", required: true },
      { key: "department_id", label: "Department ID", required: true },
      { key: "employment_type", label: "Employment Type", kind: "select", options: ["full_time", "part_time", "contract", "internship"].map(value => ({ label: value, value })) },
      { key: "experience_level", label: "Experience", kind: "select", options: ["entry", "mid", "senior", "lead", "executive"].map(value => ({ label: value, value })) },
      { key: "work_mode", label: "Work Mode", kind: "select", options: ["onsite", "remote", "hybrid"].map(value => ({ label: value, value })) },
      { key: "location", label: "Location", required: true },
      { key: "salary_min", label: "Salary Min", kind: "number" },
      { key: "salary_max", label: "Salary Max", kind: "number" },
      { key: "salary_currency", label: "Currency" },
      { key: "salary_visible", label: "Show Salary", kind: "boolean" },
      { key: "summary", label: "Summary", kind: "textarea", required: true },
      { key: "description", label: "Description", kind: "textarea", required: true },
      { key: "responsibilities", label: "Responsibilities", kind: "csv" },
      { key: "requirements", label: "Requirements", kind: "csv" },
      { key: "nice_to_have", label: "Nice To Have", kind: "csv" },
      { key: "benefits_note", label: "Benefits Note", kind: "textarea" },
      { key: "tags", label: "Tags", kind: "csv" },
      activeField,
      { key: "is_featured", label: "Featured", kind: "boolean" },
      { key: "application_deadline", label: "Deadline", kind: "date" },
    ],
  },
  job_applications: {
    id: "job_applications",
    title: "Applications",
    table: "job_applications",
    primaryKey: "id",
    orderBy: "submitted_at DESC",
    fields: [
      { key: "id", label: "ID", kind: "readonly" },
      { key: "first_name", label: "First Name", kind: "readonly" },
      { key: "last_name", label: "Last Name", kind: "readonly" },
      { key: "email", label: "Email", kind: "readonly" },
      { key: "phone", label: "Phone", kind: "readonly" },
      { key: "status", label: "Status", kind: "select", options: ["submitted", "under_review", "shortlisted", "interview_scheduled", "offer_extended", "hired", "rejected", "withdrawn"].map(value => ({ label: value, value })) },
      { key: "resume_url", label: "Resume", kind: "readonly" },
      { key: "reviewer_notes", label: "Reviewer Notes", kind: "textarea" },
      { key: "submitted_at", label: "Submitted", kind: "readonly" },
    ],
  },
  careers_values: {
    id: "careers_values",
    title: "Values",
    table: "careers_values",
    primaryKey: "id",
    orderBy: "sort_order ASC",
    revalidate: ["path:/join-us"],
    createFields: ["icon", "title", "description"],
    fields: [
      { key: "id", label: "ID", kind: "readonly" },
      { key: "icon", label: "Icon", required: true },
      { key: "title", label: "Title", required: true },
      { key: "description", label: "Description", kind: "textarea", required: true },
      sortField,
      activeField,
    ],
  },
  careers_benefits: {
    id: "careers_benefits",
    title: "Benefits",
    table: "careers_benefits",
    primaryKey: "id",
    orderBy: "sort_order ASC",
    revalidate: ["path:/join-us"],
    createFields: ["icon", "title", "description"],
    fields: [
      { key: "id", label: "ID", kind: "readonly" },
      { key: "icon", label: "Icon", required: true },
      { key: "title", label: "Title", required: true },
      { key: "description", label: "Description", kind: "textarea", required: true },
      sortField,
      activeField,
    ],
  },
  contact_submissions: {
    id: "contact_submissions",
    title: "Contact Messages",
    table: "contact_submissions",
    primaryKey: "id",
    orderBy: "submitted_at DESC",
    fields: [
      { key: "id", label: "ID", kind: "readonly" },
      { key: "full_name", label: "Name", kind: "readonly" },
      { key: "email", label: "Email", kind: "readonly" },
      { key: "phone", label: "Phone", kind: "readonly" },
      { key: "subject", label: "Subject", kind: "readonly" },
      { key: "message", label: "Message", kind: "readonly" },
      { key: "status", label: "Status", kind: "select", options: ["new", "read", "replied", "archived"].map(value => ({ label: value, value })) },
      { key: "newsletter_opt_in", label: "Newsletter", kind: "readonly" },
      { key: "submitted_at", label: "Submitted", kind: "readonly" },
    ],
  },
  contact_offices: {
    id: "contact_offices",
    title: "Offices",
    table: "contact_offices",
    primaryKey: "id",
    orderBy: "sort_order ASC",
    revalidate: ["path:/contact-us"],
    createFields: ["label", "address_line1", "city", "state", "pincode", "country", "phone", "email"],
    fields: [
      { key: "id", label: "ID", kind: "readonly" },
      { key: "label", label: "Label", required: true },
      { key: "address_line1", label: "Address 1", required: true },
      { key: "address_line2", label: "Address 2" },
      { key: "city", label: "City", required: true },
      { key: "state", label: "State", required: true },
      { key: "pincode", label: "Pincode", required: true },
      { key: "country", label: "Country", required: true },
      { key: "phone", label: "Phone", required: true },
      { key: "email", label: "Email", required: true },
      { key: "map_embed_url", label: "Map Embed URL" },
      { key: "map_link_url", label: "Map Link URL" },
      { key: "is_primary", label: "Primary", kind: "boolean" },
      sortField,
      activeField,
    ],
  },
  contact_faq_items: {
    id: "contact_faq_items",
    title: "Contact FAQs",
    table: "contact_faq_items",
    primaryKey: "id",
    orderBy: "sort_order ASC",
    revalidate: ["path:/contact-us"],
    createFields: ["question", "answer"],
    fields: [
      { key: "id", label: "ID", kind: "readonly" },
      { key: "question", label: "Question", required: true },
      { key: "answer", label: "Answer", kind: "textarea", required: true },
      sortField,
      activeField,
    ],
  },
  nav_items: {
    id: "nav_items",
    title: "Navigation Items",
    table: "nav_items",
    primaryKey: "id",
    orderBy: "parent_id NULLS FIRST, sort_order ASC",
    revalidate: ["header", "footer"],
    createFields: ["label", "href"],
    fields: [
      { key: "id", label: "ID", kind: "readonly" },
      { key: "parent_id", label: "Parent ID", kind: "number" },
      { key: "label", label: "Label", required: true },
      { key: "href", label: "Link", required: true },
      { key: "description", label: "Description" },
      { key: "icon_name", label: "Icon Name" },
      sortField,
      activeField,
      { key: "open_in_new", label: "Open New Tab", kind: "boolean" },
    ],
  },
  announcements: {
    id: "announcements",
    title: "Announcements",
    table: "announcements",
    primaryKey: "id",
    orderBy: "section ASC, sort_order ASC",
    revalidate: ["header", "footer"],
    createFields: ["text", "section"],
    fields: [
      { key: "id", label: "ID", kind: "readonly" },
      { key: "emoji", label: "Emoji" },
      { key: "text", label: "Text", kind: "textarea", required: true },
      { key: "link_url", label: "Link" },
      { key: "section", label: "Section", kind: "select", options: ["header", "footer"].map(value => ({ label: value, value })) },
      sortField,
      activeField,
      { key: "starts_at", label: "Starts At", kind: "date" },
      { key: "ends_at", label: "Ends At", kind: "date" },
    ],
  },
  feature_flags: {
    id: "feature_flags",
    title: "Feature Flags",
    table: "feature_flags",
    primaryKey: "id",
    orderBy: "key ASC",
    revalidate: ["header", "footer", "hero", "about", "stats", "path:/contact-us", "path:/join-us", "path:/board-of-directors"],
    fields: [
      { key: "id", label: "ID", kind: "readonly" },
      { key: "key", label: "Key", kind: "readonly" },
      { key: "is_enabled", label: "Enabled", kind: "boolean" },
      { key: "description", label: "Description", kind: "textarea" },
    ],
  },
};

export const modules: Record<string, AdminModule> = {
  "site-content": {
    id: "site-content",
    title: "Site Content",
    eyebrow: "Content",
    description: "Manage shared copy, page heroes, stats, and about-section content.",
    resources: ["site_config", "page_heroes", "page_stats", "about_paragraphs", "about_districts", "about_sdg_badges", "about_news_items"],
  },
  gallery: {
    id: "gallery",
    title: "Gallery",
    eyebrow: "Media",
    description: "Manage gallery images, categories, tags, featured state, and display ordering.",
    resources: ["gallery_items"],
  },
  board: {
    id: "board",
    title: "Board",
    eyebrow: "Governance",
    description: "Manage board members, roles, chairman display, biographies, and ordering.",
    resources: ["bod_members", "bod_roles"],
  },
  careers: {
    id: "careers",
    title: "Careers",
    eyebrow: "Operations",
    description: "Manage departments, jobs, applications, values, and benefits.",
    resources: ["job_openings", "job_applications", "departments", "careers_values", "careers_benefits"],
  },
  contact: {
    id: "contact",
    title: "Contact CRM",
    eyebrow: "Operations",
    description: "Review enquiries, update message status, manage offices, and contact FAQs.",
    resources: ["contact_submissions", "contact_offices", "contact_faq_items"],
  },
  navigation: {
    id: "navigation",
    title: "Navigation",
    eyebrow: "Structure",
    description: "Manage top-level navigation and dropdown items.",
    resources: ["nav_items"],
  },
  announcements: {
    id: "announcements",
    title: "Announcements",
    eyebrow: "Structure",
    description: "Manage header and footer announcements with optional scheduling.",
    resources: ["announcements"],
  },
  flags: {
    id: "flags",
    title: "Feature Flags",
    eyebrow: "Structure",
    description: "Toggle website features without changing code.",
    resources: ["feature_flags"],
  },
};

export function getModule(moduleId: string) {
  return modules[moduleId] ?? null;
}

export async function getAdminModuleData(moduleId: string) {
  const module = getModule(moduleId);
  if (!module) return null;

  const data = await Promise.all(module.resources.map(async (resourceId) => {
    const resource = resources[resourceId];
    const { rows } = await pool.query(`SELECT * FROM ${resource.table} ORDER BY ${resource.orderBy} LIMIT 250`);
    return { resource, rows };
  }));

  return { module, data };
}

export async function createResourceRow(resourceId: string, values: Record<string, unknown>) {
  const resource = resources[resourceId];
  if (!resource) throw new Error("Unknown resource");

  const allowed = resource.fields.filter((field) => field.kind !== "readonly" && (field.create !== false));
  const requiredCreateFields = resource.createFields ?? allowed.filter((field) => field.required).map((field) => field.key);
  const entries = allowed
    .filter((field) => values[field.key] !== undefined && values[field.key] !== "")
    .map((field) => [field, normalizeFieldValue(field, values[field.key])] as const);

  for (const key of requiredCreateFields) {
    if (!entries.some(([field]) => field.key === key)) {
      throw new Error(`${labelFor(resource, key)} is required`);
    }
  }

  if (!entries.length) throw new Error("No values supplied");

  const columns = entries.map(([field]) => field.key);
  const placeholders = entries.map((_, index) => `$${index + 1}`);
  const params = entries.map(([, value]) => value);

  await pool.query(
    `INSERT INTO ${resource.table} (${columns.join(", ")}) VALUES (${placeholders.join(", ")})`,
    params
  );
  revalidateFor(resource);
}

export async function updateResourceRow(resourceId: string, id: string | number, values: Record<string, unknown>) {
  const resource = resources[resourceId];
  if (!resource) throw new Error("Unknown resource");

  const allowed = new Map(resource.fields.filter((field) => field.kind !== "readonly").map((field) => [field.key, field]));
  const entries = Object.entries(values)
    .filter(([key]) => allowed.has(key))
    .map(([key, value]) => [allowed.get(key)!, normalizeFieldValue(allowed.get(key)!, value)] as const);

  if (!entries.length) throw new Error("No editable values supplied");

  const setSql = entries.map(([field], index) => `${field.key} = $${index + 1}`).join(", ");
  const params = entries.map(([, value]) => value);

  await pool.query(
    `UPDATE ${resource.table} SET ${setSql} WHERE ${resource.primaryKey} = $${entries.length + 1}`,
    [...params, id]
  );
  revalidateFor(resource);
}

function normalizeFieldValue(field: AdminField, value: unknown) {
  if (field.kind === "boolean") return value === true || value === "true";
  if (field.kind === "number") return value === "" || value == null ? null : Number(value);
  if (field.kind === "csv") {
    if (Array.isArray(value)) return value;
    return String(value ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (field.kind === "date") return value ? String(value) : null;
  return value === "" ? null : value;
}

function labelFor(resource: AdminResource, key: string) {
  return resource.fields.find((field) => field.key === key)?.label ?? key;
}

function revalidateFor(resource: AdminResource) {
  for (const item of resource.revalidate ?? []) {
    if (item.startsWith("path:")) {
      revalidatePath(item.slice(5));
    } else {
      revalidateTag(item);
    }
  }
}
