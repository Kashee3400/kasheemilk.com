import type { ServiceItem, TestimonialItem, GalleryItem } from "@/types";

export const SITE_NAME = "Kashee Milk Producer Company Limited";
export const SITE_TAGLINE = "Empowering Women Through Dairy";

export const SERVICES: ServiceItem[] = [
  {
    id: "pashu-sanjivani",
    title: "Pashu Sanjivani Seva",
    description: "Provide affordable veterinary healthcare services to members' animals at their doorstep.",
    href: "/kashee-pashu-sanjivani-seva-mobile-veterinary",
    image: "https://www.kasheemilk.com/wp-content/uploads/2026/01/Ambulance-img1.png",
  },
  {
    id: "animal-breeding",
    title: "Animal Breeding Services",
    description: "Dairy animal breeding of utmost importance in the dairy industry for improving milk yield.",
    href: "/animal-breeding-services",
    image: "https://www.kasheemilk.com/wp-content/uploads/2023/05/Artificial-insemination.jpg",
  },
  {
    id: "cattle-feed",
    title: "Balanced Cattle Feed",
    description: "Increase milk yield of milch animals with scientifically balanced cattle feed & mineral mixture.",
    href: "/animal-nutrition-products",
    image: "https://www.kasheemilk.com/wp-content/uploads/2026/01/MM-and-cff-img1.webp",
  },
  {
    id: "fodder-seed",
    title: "Fodder Seed Distribution",
    description: "Green fodder is a highly nutritious and cost-effective feed for dairy animals.",
    href: "/animal-nutrition-products",
    image: "https://www.kasheemilk.com/wp-content/uploads/2023/05/Fodder-Seedimg.jpg",
  },
  {
    id: "animal-health",
    title: "Animal Health Initiatives",
    description: "Preventive healthcare to combat mastitis and other dairy animal diseases.",
    href: "/animal-health-preventive-initiatives",
    image: "https://www.kasheemilk.com/wp-content/uploads/2023/05/Mastitis-Diagnosis-Contro1.jpg",
  },
  {
    id: "training",
    title: "Dairy Management Training",
    description: "Empowering farmers with knowledge for successful dairy farm management.",
    href: "/trainings",
    image: "https://www.kasheemilk.com/wp-content/uploads/2023/05/Dairy-Management-Training-DMT-2.jpg",
  },
];


export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "1",
    quote: "I am honored to be part of a women-owned organization that empowers women through sustainable livelihood opportunities. Over the past two years, I have witnessed the company's dedication to employee growth and talent recognition.",
    author: "Mekhla",
    image: "https://www.kasheemilk.com/wp-content/uploads/2024/10/Mekhla-Photo.jpg",
  },
  {
    id: "2",
    quote: "I am thrilled to be a part of Kashee Milk Producer Organization as an Executive-IT. The supportive team and positive work culture have made it a wonderful place to grow my skills and contribute meaningfully.",
    author: "Divyanshu",
    role: "Executive-IT (Software Developer)",
    image: "https://www.kasheemilk.com/wp-content/uploads/2024/10/dk-img.jpg",
  },
];

export const GALLERY_IMAGES: GalleryItem[] = [
  { id: "1", size: "normal", image: "https://www.kasheemilk.com/wp-content/uploads/2025/01/hg.jpg", alt: "Kashee Gallery", href: "/gallery" },
  { id: "2", size: "normal", image: "https://www.kasheemilk.com/wp-content/uploads/2024/09/hgallery4.jpg", alt: "Kashee Gallery", href: "/gallery" },
  { id: "3", size: "normal", image: "https://www.kasheemilk.com/wp-content/uploads/2025/09/agm-2025-gallery1.jpg", alt: "AGM 2025", href: "/gallery" },
  { id: "4", size: "normal", image: "https://www.kasheemilk.com/wp-content/uploads/2025/09/agm-2025-gallery3.jpg", alt: "AGM 2025", href: "/gallery" },
  { id: "5", size: "normal", image: "https://www.kasheemilk.com/wp-content/uploads/2025/09/agm-2025-gallery4.jpg", alt: "AGM 2025", href: "/gallery" },
  { id: "6", size: "normal", image: "https://www.kasheemilk.com/wp-content/uploads/2025/09/agm-2025-gallery2.jpg", alt: "AGM 2025", href: "/gallery" },
];

export const CONTACT_INFO = {
  address: "2nd floor S-2/1-77, Tagore town extension, Panchkoshi Road, Varanasi – 221002",
  phone: "0542-4085526",
  email: "info@kasheemilk.com",
  social: {
    facebook: "https://www.facebook.com/people/Kashee-Milk-Producer-Company/100080985653961/",
    linkedin: "https://www.linkedin.com/in/kashee-milk-933a4223b/",
    youtube: "https://www.youtube.com/channel/UCJkNzlRPmV-sWKG0mCSL9ew",
    twitter: "https://twitter.com/KasheeMilk",
  },
};
