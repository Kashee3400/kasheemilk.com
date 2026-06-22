import Image from "next/image";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Kashee Milk Producer Company Limited — our story, mission, and impact.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-kashee-ivory">
      {/* Page hero */}
      <div className="bg-gradient-to-r from-kashee-forest to-kashee-forest-light py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 70% 50%, white 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <SectionHeading
            label="Our Story"
            title="About Kashee Milk"
            subtitle="A people-first dairy cooperative rooted in Varanasi, serving Eastern Uttar Pradesh."
            light
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-5 font-body text-kashee-charcoal/70 leading-relaxed">
            <p>
              Kashee Milk Producer Company Limited was incorporated in <strong className="text-kashee-charcoal">November 2021</strong> in Varanasi with the goal of providing a sustainable livelihood alternative to women milk producers through dairy farming, initially targeting five districts in Uttar Pradesh.
            </p>
            <p>
              The company commenced its business operations from <strong className="text-kashee-charcoal">March 2022</strong> under the project titled "Dairy Value Chain Development in Eastern Uttar Pradesh." The project spans four financial years starting from December 2021 to March 2025.
            </p>
            <p>
              With financial assistance from <strong className="text-kashee-charcoal">UPSRLM</strong> and technical support from <strong className="text-kashee-charcoal">NDDB Dairy Services</strong>, Kashee Milk now operates across seven districts: Ballia, Chandauli, Ghazipur, Mirzapur, Sonbhadra, Bhadohi, and Varanasi.
            </p>
            <div className="flex gap-4 pt-4">
              <Button href="/chairmans-message">Chairman's Message</Button>
              <Button href="/board-of-directors" variant="outline">Board of Directors</Button>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden aspect-video bg-kashee-cream">
            <Image
              src="https://www.kasheemilk.com/wp-content/uploads/2024/04/Member-corner.jpg"
              alt="About Kashee Milk"
              fill
              className="object-cover object-top"
              unoptimized
            />
          </div>
        </div>

        {/* Sub-nav cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: "Mission", href: "/mission" },
            { label: "Vision", href: "/vision" },
            { label: "Values", href: "/values" },
            { label: "Milestone", href: "/milestone" },
            { label: "Board", href: "/board-of-directors" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="bg-white rounded-2xl p-6 text-center border border-kashee-amber/10 hover:border-kashee-amber/40 hover:shadow-lg hover:-translate-y-1 transition-all font-body font-medium text-kashee-charcoal hover:text-kashee-amber"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
