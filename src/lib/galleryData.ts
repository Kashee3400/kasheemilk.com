
// ─── Gallery Seed Data ────────────────────────────────────────────────────────
// Replace image URLs with your actual CDN/CMS sources.
// All metadata here drives the UI — categories, tags, dates, etc.

// ─── Category Config ───────────────────────────────────────────────────────────
// Centralised label + icon map. Add new categories here only.
export const CATEGORY_CONFIG = {
    all: { label: "All", emoji: "✦" },
    events: { label: "Events", emoji: "🎉" },
    milestones: { label: "Milestones", emoji: "🏆" },
    team: { label: "Team", emoji: "👥" },
    products: { label: "Products", emoji: "🥛" },
    community: { label: "Community", emoji: "🤝" },
} as const;