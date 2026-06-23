import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { gquery } from "@/lib/db";
import type { CmsPageRow } from "@/types/db";
import { getBaseUrl } from "@/lib/db";
import RichContent from "@/components/ui/RichContent";

interface PageProps {
  params: { slug: string };
}

async function getPageBySlug(slug: string): Promise<CmsPageRow | null> {
  try {
    const rows = await gquery<CmsPageRow>(
      `SELECT * FROM cms_pages WHERE slug = $1 AND status = 'published' LIMIT 1`,
      [slug]
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);

  if (!page) {
    return { title: "Page Not Found" };
  }

  const baseUrl = getBaseUrl();
  const canonicalUrl = `${baseUrl}/pages/${page.slug}`;
  const metaTitle = page.meta_title || page.title;
  const metaDescription = page.meta_description || page.short_description || "";

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: page.seo_keywords?.join(", ") || undefined,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "article",
      url: canonicalUrl,
      images: page.featured_image_url
        ? [{ url: page.featured_image_url, width: 1200, height: 630, alt: page.title }]
        : undefined,
    },
    twitter: {
      card: page.featured_image_url ? "summary_large_image" : "summary",
      title: metaTitle,
      description: metaDescription,
      images: page.featured_image_url ? [page.featured_image_url] : undefined,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export async function generateStaticParams() {
  try {
    const pages = await gquery<Pick<CmsPageRow, "slug">>(
      `SELECT slug FROM cms_pages WHERE status = 'published'`
    );
    return pages.map((page) => ({ slug: page.slug }));
  } catch {
    // During build without DB, return empty array
    return [];
  }
}

export const revalidate = 60;

export default async function CmsDynamicPage({ params }: PageProps) {
  const page = await getPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-kashee-ivory">
      {/* Hero section with featured image */}
      <div className="bg-gradient-to-r from-kashee-forest to-kashee-forest-light py-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 70% 50%, white 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <p className="mb-2 inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white/80">
              Page
            </p>
            <h1 className="font-body text-3xl font-bold tracking-normal text-white md:text-4xl lg:text-5xl">
              {page.title}
            </h1>
            {page.short_description && (
              <p className="mt-4 text-lg leading-relaxed text-white/80">
                {page.short_description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Featured image */}
      {page.featured_image_url && (
        <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-kashee-cream">
            <Image
              src={page.featured_image_url}
              alt={page.title}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          </div>
        </div>
      )}

      {/* Page content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <RichContent html={page.page_content} className="prose prose-lg prose-kashee max-w-none" />
      </div>
    </div>
  );
}
