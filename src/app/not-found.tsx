import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-kashee-ivory">
      <span className="font-accent text-kashee-amber text-8xl mb-4">404</span>
      <h1 className="font-display text-3xl md:text-4xl text-kashee-charcoal mb-4">Page Not Found</h1>
      <p className="font-body text-kashee-charcoal/60 max-w-md mb-8">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Button variant="ghost" href="/">Go Home</Button>
    </div>
  );
}
