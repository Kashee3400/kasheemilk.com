"use client";

import { useMemo, useState } from "react";
import { Check, Eye, ImagePlus, Loader2, Plus, Save, ToggleLeft, ToggleRight } from "lucide-react";
import type { AdminHeroData } from "@/lib/admin/hero";

type Slide = AdminHeroData["slides"][number];
type ConfigItem = AdminHeroData["config"][number];
type FlagItem = AdminHeroData["flags"][number];

type DraftSlide = Pick<Slide,
  "image_url" | "image_alt" | "eyebrow" | "title" | "title_accent" |
  "description" | "cta_label" | "cta_href" | "tag_label" | "sort_order" | "is_active"
>;

const blankSlide: DraftSlide = {
  image_url: "",
  image_alt: "",
  eyebrow: "",
  title: "",
  title_accent: "",
  description: "",
  cta_label: "",
  cta_href: "",
  tag_label: "",
  sort_order: 10,
  is_active: true,
};

export default function HeroManager({ initialData }: { initialData: AdminHeroData }) {
  const [slides, setSlides] = useState(initialData.slides);
  const [config, setConfig] = useState(initialData.config);
  const [flags, setFlags] = useState(initialData.flags);
  const [selectedId, setSelectedId] = useState(slides[0]?.id ?? 0);
  const [draft, setDraft] = useState<DraftSlide>(() => toDraft(slides[0]));
  const [newSlide, setNewSlide] = useState<DraftSlide>(blankSlide);
  const [saving, setSaving] = useState("");
  const [notice, setNotice] = useState("");

  const selectedSlide = useMemo(
    () => slides.find((slide) => slide.id === selectedId),
    [selectedId, slides]
  );

  function selectSlide(slide: Slide) {
    setSelectedId(slide.id);
    setDraft(toDraft(slide));
    setNotice("");
  }

  async function refresh() {
    const res = await fetch("/api/admin/hero", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json() as AdminHeroData;
    setSlides(data.slides);
    setConfig(data.config);
    setFlags(data.flags);
  }

  async function saveSlide() {
    if (!selectedSlide) return;
    setSaving("slide");
    setNotice("");
    const res = await patch({
      kind: "slide",
      id: selectedSlide.id,
      updates: draft,
    });
    setSaving("");
    if (res.ok) {
      await refresh();
      setNotice("Hero slide saved.");
    }
  }

  async function createSlide() {
    setSaving("new");
    setNotice("");
    const res = await fetch("/api/admin/hero", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSlide),
    });
    setSaving("");
    if (res.ok) {
      setNewSlide(blankSlide);
      await refresh();
      setNotice("New hero slide created.");
    } else {
      const data = await res.json().catch(() => ({ error: "Unable to create slide." }));
      setNotice(data.error || "Unable to create slide.");
    }
  }

  async function saveConfig(item: ConfigItem, value: string) {
    setSaving(item.key);
    const res = await patch({ kind: "config", key: item.key, value });
    setSaving("");
    if (res.ok) {
      setConfig((current) => current.map((entry) => entry.key === item.key ? { ...entry, value } : entry));
      setNotice("Hero settings saved.");
    }
  }

  async function toggleFlag(item: FlagItem) {
    const next = !item.is_enabled;
    setFlags((current) => current.map((entry) => entry.key === item.key ? { ...entry, is_enabled: next } : entry));
    const res = await patch({ kind: "flag", key: item.key, is_enabled: next });
    if (!res.ok) {
      setFlags((current) => current.map((entry) => entry.key === item.key ? { ...entry, is_enabled: item.is_enabled } : entry));
    } else {
      setNotice("Feature flag updated.");
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-md bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-primary-700">
            <ImagePlus size={14} />
            Home Page CMS
          </p>
          <h1 className="font-body text-2xl font-bold tracking-normal text-ink-900 md:text-3xl">Hero Slider</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-500">
            Edit the live homepage slider, timing, CTA copy, and display options.
          </p>
        </div>
        {notice ? (
          <p className="inline-flex items-center gap-2 rounded-md border border-primary-100 bg-white px-3 py-2 text-sm font-semibold text-primary-700">
            <Check size={16} />
            {notice}
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <section className="rounded-lg border border-ink-100 bg-white">
          <div className="border-b border-ink-100 px-4 py-3">
            <h2 className="font-body text-base font-bold tracking-normal text-ink-900">Slides</h2>
          </div>
          <div className="max-h-[620px] overflow-y-auto p-3">
            {slides.map((slide) => (
              <button
                key={slide.id}
                onClick={() => selectSlide(slide)}
                className={[
                  "mb-2 grid w-full grid-cols-[72px_1fr] gap-3 rounded-md border p-2 text-left",
                  selectedId === slide.id ? "border-primary-300 bg-primary-50" : "border-ink-100 bg-white hover:bg-ink-50",
                ].join(" ")}
              >
                <img src={slide.image_url} alt="" className="h-16 w-[72px] rounded object-cover" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-ink-900">{slide.title || slide.image_alt}</span>
                  <span className="mt-1 block truncate text-xs text-ink-500">Order {slide.sort_order}</span>
                  <span className={[
                    "mt-2 inline-flex rounded px-2 py-0.5 text-[11px] font-bold",
                    slide.is_active ? "bg-primary-100 text-primary-800" : "bg-ink-100 text-ink-500",
                  ].join(" ")}>
                    {slide.is_active ? "Active" : "Hidden"}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-5">
          <div className="rounded-lg border border-ink-100 bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-body text-base font-bold tracking-normal text-ink-900">Edit Selected Slide</h2>
              <button
                onClick={saveSlide}
                disabled={!selectedSlide || saving === "slide"}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-primary-800 px-4 text-sm font-bold text-white hover:bg-primary-700 disabled:opacity-60"
              >
                {saving === "slide" ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save
              </button>
            </div>
            <SlideFields draft={draft} setDraft={setDraft} />
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <div className="rounded-lg border border-ink-100 bg-white p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-body text-base font-bold tracking-normal text-ink-900">Create Slide</h2>
                <button
                  onClick={createSlide}
                  disabled={saving === "new"}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-primary-200 bg-primary-50 px-4 text-sm font-bold text-primary-800 hover:bg-primary-100 disabled:opacity-60"
                >
                  {saving === "new" ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  Add
                </button>
              </div>
              <SlideFields draft={newSlide} setDraft={setNewSlide} compact />
            </div>

            <div className="rounded-lg border border-ink-100 bg-white">
              <div className="border-b border-ink-100 px-5 py-4">
                <h2 className="font-body text-base font-bold tracking-normal text-ink-900">Hero Settings</h2>
              </div>
              <div className="divide-y divide-ink-100">
                {config.map((item) => (
                  <ConfigRow key={item.key} item={item} saving={saving === item.key} onSave={saveConfig} />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-ink-100 bg-white">
            <div className="border-b border-ink-100 px-5 py-4">
              <h2 className="font-body text-base font-bold tracking-normal text-ink-900">Display Features</h2>
            </div>
            <div className="grid gap-0 divide-y divide-ink-100 md:grid-cols-2 md:divide-x md:divide-y-0">
              {flags.map((item) => (
                <button
                  key={item.key}
                  onClick={() => toggleFlag(item)}
                  className="flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-ink-50"
                >
                  <span>
                    <span className="block text-sm font-bold text-ink-800">{item.key}</span>
                    {item.description ? <span className="mt-1 block text-xs leading-5 text-ink-500">{item.description}</span> : null}
                  </span>
                  {item.is_enabled ? (
                    <ToggleRight className="shrink-0 text-primary-700" size={28} />
                  ) : (
                    <ToggleLeft className="shrink-0 text-ink-400" size={28} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SlideFields({
  draft,
  setDraft,
  compact = false,
}: {
  draft: DraftSlide;
  setDraft: React.Dispatch<React.SetStateAction<DraftSlide>>;
  compact?: boolean;
}) {
  const fields: { key: keyof DraftSlide; label: string; type?: string; area?: boolean }[] = [
    { key: "image_url", label: "Image URL" },
    { key: "image_alt", label: "Image Alt" },
    { key: "eyebrow", label: "Eyebrow" },
    { key: "title", label: "Title" },
    { key: "title_accent", label: "Title Accent" },
    { key: "description", label: "Description", area: true },
    { key: "cta_label", label: "CTA Label" },
    { key: "cta_href", label: "CTA Link" },
    { key: "tag_label", label: "Tag Label" },
    { key: "sort_order", label: "Sort Order", type: "number" },
  ];

  return (
    <div className={compact ? "grid gap-3" : "grid gap-3 md:grid-cols-2"}>
      {!compact && draft.image_url ? (
        <div className="md:col-span-2">
          <div className="relative overflow-hidden rounded-lg border border-ink-100 bg-ink-50">
            <img src={draft.image_url} alt="" className="h-56 w-full object-cover" />
            <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-md bg-white/90 px-3 py-1.5 text-xs font-bold text-ink-700">
              <Eye size={14} />
              Preview
            </div>
          </div>
        </div>
      ) : null}

      {fields.map((field) => (
        <label key={field.key} className={field.area ? "md:col-span-2" : undefined}>
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.08em] text-ink-500">{field.label}</span>
          {field.area ? (
            <textarea
              value={String(draft[field.key] ?? "")}
              onChange={(event) => updateDraft(setDraft, field.key, event.target.value)}
              className="min-h-24 w-full rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100"
            />
          ) : (
            <input
              value={String(draft[field.key] ?? "")}
              type={field.type || "text"}
              onChange={(event) => updateDraft(setDraft, field.key, field.type === "number" ? Number(event.target.value) : event.target.value)}
              className="h-10 w-full rounded-md border border-ink-200 px-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100"
            />
          )}
        </label>
      ))}

      <label className="flex items-center gap-3 rounded-md border border-ink-100 bg-ink-50 px-3 py-2">
        <input
          checked={draft.is_active}
          onChange={(event) => updateDraft(setDraft, "is_active", event.target.checked)}
          type="checkbox"
          className="h-4 w-4 accent-primary-700"
        />
        <span className="text-sm font-bold text-ink-700">Active on website</span>
      </label>
    </div>
  );
}

function ConfigRow({
  item,
  saving,
  onSave,
}: {
  item: ConfigItem;
  saving: boolean;
  onSave: (item: ConfigItem, value: string) => void;
}) {
  const [value, setValue] = useState(item.value || "");

  return (
    <div className="grid gap-3 px-5 py-4">
      <label>
        <span className="mb-1 block text-xs font-bold uppercase tracking-[0.08em] text-ink-500">
          {item.label || item.key}
        </span>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="h-10 w-full rounded-md border border-ink-200 px-3 text-sm outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-100"
        />
      </label>
      <button
        onClick={() => onSave(item, value)}
        className="inline-flex h-9 w-fit items-center gap-2 rounded-md border border-ink-100 px-3 text-sm font-bold text-ink-700 hover:border-primary-200 hover:text-primary-700"
      >
        {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        Save setting
      </button>
    </div>
  );
}

function toDraft(slide?: Slide): DraftSlide {
  if (!slide) return blankSlide;
  return {
    image_url: slide.image_url || "",
    image_alt: slide.image_alt || "",
    eyebrow: slide.eyebrow || "",
    title: slide.title || "",
    title_accent: slide.title_accent || "",
    description: slide.description || "",
    cta_label: slide.cta_label || "",
    cta_href: slide.cta_href || "",
    tag_label: slide.tag_label || "",
    sort_order: slide.sort_order,
    is_active: slide.is_active,
  };
}

function updateDraft(
  setDraft: React.Dispatch<React.SetStateAction<DraftSlide>>,
  key: keyof DraftSlide,
  value: string | number | boolean
) {
  setDraft((current) => ({ ...current, [key]: value }));
}

function patch(body: Record<string, unknown>) {
  return fetch("/api/admin/hero", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
