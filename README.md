# Kashee Milk — Next.js Website

A modern, production-grade rebuild of [kasheemilk.com](https://www.kasheemilk.com) using **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

---

## 📁 Folder Structure

```
kashee-milk/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── layout.tsx              # Root layout (Header + Footer wraps all pages)
│   │   ├── page.tsx                # Home page (/)
│   │   ├── not-found.tsx           # 404 page
│   │   ├── about-us/
│   │   │   └── page.tsx            # /about-us
│   │   ├── gallery/
│   │   │   └── page.tsx            # /gallery (dynamic-ready)
│   │   ├── contact-us/
│   │   │   └── page.tsx            # /contact-us
│   │   └── [slug]/                 # (add for other dynamic routes)
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── layout/                 # Site-wide layout components
│   │   │   ├── Header.tsx          # Sticky navbar with mega dropdown + mobile menu
│   │   │   └── Footer.tsx          # Footer with links, contact, social
│   │   │
│   │   ├── sections/               # Page sections (used in app/page.tsx)
│   │   │   ├── HeroSlider.tsx      # Autoplay image slider with CTA
│   │   │   ├── AboutSection.tsx    # About + animated news ticker
│   │   │   ├── StatsSection.tsx    # Animated number counters
│   │   │   ├── ServicesSection.tsx # 6-card services grid
│   │   │   ├── TestimonialsSection.tsx  # Quote carousel
│   │   │   ├── MemberSection.tsx   # Member links + image
│   │   │   └── GalleryPreview.tsx  # Masonry gallery preview
│   │   │
│   │   └── ui/                     # Reusable primitives
│   │       ├── Button.tsx          # Multi-variant button (supports href or onClick)
│   │       ├── SectionHeading.tsx  # Consistent section title pattern
│   │       └── AnimatedCounter.tsx # Scroll-triggered number animation
│   │
│   ├── lib/
│   │   └── data.ts                 # All site content, nav items, and mock data
│   │
│   ├── types/
│   │   └── index.ts                # Shared TypeScript types
│   │
│   └── styles/
│       └── globals.css             # Global styles, CSS variables, animations
│
├── public/                         # Static assets
├── next.config.mjs                 # Next.js config (image domains, etc.)
├── tailwind.config.ts              # Design tokens (colors, fonts, animations)
├── tsconfig.json
└── package.json
```

---

## 🎨 Design System

### Colors (in `tailwind.config.ts`)
| Token | Hex | Usage |
|-------|-----|-------|
| `kashee-cream` | `#FDF8F0` | Section backgrounds |
| `kashee-amber` | `#D4873A` | Primary CTAs, accents |
| `kashee-amber-light` | `#F0A94E` | Hover states, highlights |
| `kashee-forest` | `#2D5016` | Dark headers, footer |
| `kashee-forest-light` | `#3D6B1E` | Gradient partner |
| `kashee-charcoal` | `#1A1A1A` | Body text |
| `kashee-ivory` | `#FEFCF7` | Page background |
| `kashee-milk` | `#FAFAF5` | Alternate section bg |

### Fonts
- **Display** → `Playfair Display` (headings, quotes)
- **Body** → `DM Sans` (UI, paragraphs)
- **Accent** → `Caveat` (decorative handwritten labels)

---

## 🔧 Adding New Pages

### 1. Static page (e.g. `/mission`)
```bash
mkdir -p src/app/mission
```
```tsx
// src/app/mission/page.tsx
import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = { title: "Mission" };

export default function MissionPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <SectionHeading label="Our Purpose" title="Mission" />
      <p className="font-body text-kashee-charcoal/70 leading-relaxed">
        {/* Your content */}
      </p>
    </div>
  );
}
```

### 2. Dynamic pages (e.g. `/news/[slug]`)
```bash
mkdir -p src/app/category/news-and-updates/[slug]
```
```tsx
// src/app/category/news-and-updates/[slug]/page.tsx
interface Props {
  params: { slug: string };
}

// Generate static paths at build time (optional)
export async function generateStaticParams() {
  // const posts = await fetchPosts();
  // return posts.map(p => ({ slug: p.slug }));
  return [];
}

export default async function NewsDetailPage({ params }: Props) {
  // const post = await fetchPost(params.slug);
  return <div>Post: {params.slug}</div>;
}
```

---

## 📡 Connecting to a CMS / API

All content lives in `src/lib/data.ts` as mock data. To connect a real CMS:

### Option A: WordPress REST API (matches current site)
```ts
// src/lib/api.ts
export async function fetchNews() {
  const res = await fetch('https://www.kasheemilk.com/wp-json/wp/v2/posts', {
    next: { revalidate: 3600 } // ISR — revalidate every hour
  });
  return res.json();
}
```

### Option B: Sanity / Contentful / Strapi
Install the SDK, create a client in `src/lib/cms.ts`, and call from Server Components.

---

## 🖼️ Dynamic Gallery (Future)

The gallery page at `src/app/gallery/page.tsx` is already set up as a Server Component:

```tsx
async function getGalleryImages() {
  // Replace with real API call:
  const res = await fetch('/api/gallery', { next: { revalidate: 3600 } });
  return res.json();
}
```

For infinite scroll or pagination, convert to a Client Component using `useState` + `IntersectionObserver`, or use a library like `react-infinite-scroll-component`.

---

## 🚀 Deployment

### Vercel (recommended — zero config)
```bash
npx vercel
```

### Self-hosted (Node.js server)
```bash
npm run build
npm run start
```

### Environment variables
Create a `.env.local` file for any API keys:
```env
NEXT_PUBLIC_SITE_URL=https://www.kasheemilk.com
CMS_API_KEY=your_key_here
```

---

## 📦 Key Packages

| Package | Purpose |
|---------|---------|
| `next@14` | Framework with App Router |
| `framer-motion` | Animations (optional enhancement) |
| `lucide-react` | Icon set |
| `clsx` | Conditional class merging |
| `tailwindcss` | Utility CSS |

---

## 🔄 Extending Components

### Adding a new service card
Edit `src/lib/data.ts` → `SERVICES` array.

### Adding nav items
Edit `src/lib/data.ts` → `NAV_ITEMS` array. The Header automatically renders dropdowns for items with `children`.

### Adding a testimonial
Edit `src/lib/data.ts` → `TESTIMONIALS` array.

---

## 🎯 Performance Notes

- All images use `next/image` with `unoptimized` flag for external URLs. Remove `unoptimized` if you proxy images through Next.js.
- Hero images use `priority` prop for LCP optimization.
- Gallery images lazy-load by default.
- Fonts are loaded from Google via `@import` in `globals.css` — for production, consider using `next/font`.

---

## 📞 Contact & Support
For any issues, reach out to the development team.
