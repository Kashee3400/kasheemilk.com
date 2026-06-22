
// Service types
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
}


// Testimonial types
export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role?: string;
  image: string;
  village?: string;
  rating?: number;
}

// Gallery types
export interface GalleryItem {
  id: string;
  image: string;
  alt: string;
  href?: string;
  size: string;
  category?: string;
}
