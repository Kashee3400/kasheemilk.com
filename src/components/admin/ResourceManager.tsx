"use client";

import { useMemo, useState } from "react";
import { Check, Loader2, Plus, RefreshCw, Save } from "lucide-react";
import type { AdminField, AdminModule, AdminResource } from "@/lib/admin/resources";

type ResourcePayload = {
  module: AdminModule;
  data: {
    resource: AdminResource;
    rows: Record<string, unknown>[];
  }[];
};

type Props = {
  initialData: ResourcePayload;
};

export default function ResourceManager({ initialData }: Props) {
  const [payload, setPayload] = useState(initialData);
  const [resourceId, setResourceId] = useState(initialData.data[0]?.resource.id ?? "");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [draft, setDraft] = useState<Record<string, unknown>>(() => initialData.data[0]?.rows[0] ?? {});
  const [createDraft, setCreateDraft] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState("");
  const [notice, setNotice] = useState("");

  const activeResourceData = useMemo(
    () => payload.data.find((item) => item.resource.id === resourceId) ?? payload.data[0],
    [payload, resourceId]
  );

  const resource = activeResourceData.resource;
  const rows = activeResourceData.rows;
  const selectedRow = rows[selectedIndex] ?? rows[0];
  const editableFields = resource.fields.filter((field) => field.kind !== "readonly");
  const createFields = resource.fields.filter((field) =>
    field.kind !== "readonly" &&
    (resource.createFields ? resource.createFields.includes(field.key) || field.create === true : field.create !== false)
  );

  function switchResource(nextResourceId: string) {
    const next = payload.data.find((item) => item.resource.id === nextResourceId);
    setResourceId(nextResourceId);
    setSelectedIndex(0);
    setDraft(next?.rows[0] ?? {});
    setCreateDraft({});
    setNotice("");
  }

  function selectRow(row: Record<string, unknown>, index: number) {
    setSelectedIndex(index);
    setDraft(row);
    setNotice("");
  }

  async function refresh() {
    setSaving("refresh");
    const res = await fetch(`/api/admin/resources?module=${payload.module.id}`, { cache: "no-store" });
    setSaving("");
    if (!res.ok) return;
    const next = await res.json() as ResourcePayload;
    setPayload(next);
    const nextResource = next.data.find((item) => item.resource.id === resource.id) ?? next.data[0];
    setResourceId(nextResource.resource.id);
    setSelectedIndex(0);
    setDraft(nextResource.rows[0] ?? {});
  }

  async function saveRow() {
    const id = draft[resource.primaryKey];
    if (id == null) return;

    setSaving("save");
    const values = Object.fromEntries(editableFields.map((field) => [field.key, draft[field.key]]));
    const res = await fetch("/api/admin/resources", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: resource.id, id, values }),
    });
    setSaving("");

    if (res.ok) {
      setNotice("Saved successfully.");
      await refresh();
    } else {
      const data = await res.json().catch(() => ({ error: "Unable to save." }));
      setNotice(data.error || "Unable to save.");
    }
  }

  async function createRow() {
    setSaving("create");
    const res = await fetch("/api/admin/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resource: resource.id, values: createDraft }),
    });
    setSaving("");

    if (res.ok) {
      setCreateDraft({});
      setNotice("Created successfully.");
      await refresh();
    } else {
      const data = await res.json().catch(() => ({ error: "Unable to create." }));
      setNotice(data.error || "Unable to create.");
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-2 inline-flex rounded-md bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-primary-700">
            {payload.module.eyebrow}
          </p>
          <h1 className="font-body text-2xl font-bold tracking-normal text-ink-900 md:text-3xl">
            {payload.module.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-500">{payload.module.description}</p>
        </div>
        <div className="flex items-center gap-3">
          {notice ? (
            <span className="inline-flex items-center gap-2 rounded-md border border-primary-100 bg-white px-3 py-2 text-sm font-semibold text-primary-700">
              <Check size={16} />
              {notice}
            </span>
          ) : null}
          <button
            onClick={refresh}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-ink-100 bg-white px-3 text-sm font-bold text-ink-700 hover:border-primary-200 hover:text-primary-700"
          >
            {saving === "refresh" ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            Refresh
          </button>
        </div>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto">
        {payload.data.map((item) => (
          <button
            key={item.resource.id}
            onClick={() => switchResource(item.resource.id)}
            className={[
              "h-10 shrink-0 rounded-md px-4 text-sm font-bold transition",
              item.resource.id === resource.id
                ? "bg-primary-800 text-white"
                : "border border-ink-100 bg-white text-ink-600 hover:border-primary-200 hover:text-primary-700",
            ].join(" ")}
          >
            {item.resource.title}
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="overflow-hidden rounded-lg border border-ink-100 bg-white">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <h2 className="font-body text-base font-bold tracking-normal text-ink-900">{resource.title}</h2>
            <span className="text-xs font-semibold text-ink-500">{rows.length} records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-ink-50 text-xs font-bold uppercase tracking-[0.08em] text-ink-500">
                <tr>
                  {resource.fields.slice(0, 5).map((field) => (
                    <th key={field.key} className="px-4 py-3">{field.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {rows.map((row, index) => (
                  <tr
                    key={String(row[resource.primaryKey] ?? index)}
                    onClick={() => selectRow(row, index)}
                    className={[
                      "cursor-pointer hover:bg-primary-50/60",
                      index === selectedIndex ? "bg-primary-50" : "",
                    ].join(" ")}
                  >
                    {resource.fields.slice(0, 5).map((field) => (
                      <td key={field.key} className="max-w-[260px] truncate px-4 py-3 text-ink-700">
                        <CellValue value={row[field.key]} field={field} />
                      </td>
                    ))}
                  </tr>
                ))}
                {!rows.length ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-sm font-medium text-ink-500">
                      No records found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="grid gap-5">
          <section className="rounded-lg border border-ink-100 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-body text-base font-bold tracking-normal text-ink-900">Edit Record</h2>
              <button
                onClick={saveRow}
                disabled={!selectedRow || saving === "save"}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-primary-800 px-3 text-sm font-bold text-white hover:bg-primary-700 disabled:opacity-60"
              >
                {saving === "save" ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                Save
              </button>
            </div>
            {selectedRow ? (
              <FieldGrid fields={resource.fields} values={draft} onChange={setDraft} />
            ) : (
              <p className="text-sm text-ink-500">Select a record to edit.</p>
            )}
          </section>

          {createFields.length ? (
            <section className="rounded-lg border border-ink-100 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-body text-base font-bold tracking-normal text-ink-900">Create Record</h2>
                <button
                  onClick={createRow}
                  disabled={saving === "create"}
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-primary-200 bg-primary-50 px-3 text-sm font-bold text-primary-800 hover:bg-primary-100 disabled:opacity-60"
                >
                  {saving === "create" ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                  Create
                </button>
              </div>
              <FieldGrid fields={createFields} values={createDraft} onChange={setCreateDraft} createMode />
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function FieldGrid({
  fields,
  values,
  onChange,
  createMode = false,
}: {
  fields: AdminField[];
  values: Record<string, unknown>;
  onChange: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  createMode?: boolean;
}) {
  return (
    <div className="grid gap-3">
      {fields.map((field) => {
        const kind = field.kind ?? "text";
        const readonly = kind === "readonly";
        const value = valueForInput(values[field.key], kind);

        return (
          <label key={field.key} className="block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.08em] text-ink-500">
              {field.label}{field.required && createMode ? " *" : ""}
            </span>
            {kind === "textarea" || (readonly && String(value).length > 80) ? (
              <textarea
                value={value}
                readOnly={readonly}
                onChange={(event) => setValue(onChange, field, event.target.value)}
                className={inputClass(readonly, "min-h-24 py-2")}
              />
            ) : kind === "boolean" ? (
              <select
                value={String(Boolean(values[field.key]))}
                onChange={(event) => setValue(onChange, field, event.target.value)}
                className={inputClass(false)}
              >
                {yesNoOptions().map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : kind === "select" ? (
              <select
                value={value}
                onChange={(event) => setValue(onChange, field, event.target.value)}
                className={inputClass(false)}
              >
                <option value="">Select</option>
                {(field.options ?? []).map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            ) : (
              <input
                value={value}
                type={kind === "number" ? "number" : kind === "date" ? "date" : "text"}
                readOnly={readonly}
                onChange={(event) => setValue(onChange, field, event.target.value)}
                className={inputClass(readonly)}
              />
            )}
          </label>
        );
      })}
    </div>
  );
}

function CellValue({ value, field }: { value: unknown; field: AdminField }) {
  if (field.kind === "boolean") {
    return (
      <span className={[
        "rounded px-2 py-1 text-xs font-bold",
        value ? "bg-primary-100 text-primary-800" : "bg-ink-100 text-ink-500",
      ].join(" ")}>
        {value ? "Yes" : "No"}
      </span>
    );
  }
  if (Array.isArray(value)) return <>{value.join(", ")}</>;
  if (value == null || value === "") return <span className="text-ink-300">Empty</span>;
  return <>{String(value)}</>;
}

function setValue(
  onChange: React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
  field: AdminField,
  value: string
) {
  onChange((current) => ({ ...current, [field.key]: value }));
}

function valueForInput(value: unknown, kind: AdminField["kind"]) {
  if (Array.isArray(value)) return value.join(", ");
  if (kind === "date" && typeof value === "string") return value.slice(0, 10);
  if (typeof value === "boolean") return String(value);
  return value == null ? "" : String(value);
}

function inputClass(readonly: boolean, extra = "") {
  return [
    "w-full rounded-md border px-3 text-sm outline-none",
    extra || "h-10",
    readonly
      ? "border-ink-100 bg-ink-50 text-ink-500"
      : "border-ink-200 bg-white text-ink-800 focus:border-primary-400 focus:ring-4 focus:ring-primary-100",
  ].join(" ");
}

function yesNoOptions() {
  return [
    { label: "Yes", value: "true" },
    { label: "No", value: "false" },
  ];
}
