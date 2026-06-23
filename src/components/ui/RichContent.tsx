import sanitizeHtml from "sanitize-html";

interface RichContentProps {
  html: string | null;
  className?: string;
}

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "br", "hr",
    "strong", "b", "em", "i", "u", "s", "sub", "sup",
    "ul", "ol", "li",
    "blockquote", "pre", "code",
    "a",
    "img",
    "figure", "figcaption",
    "table", "thead", "tbody", "tfoot", "tr", "th", "td",
    "div", "span",
    "iframe",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
    iframe: ["src", "width", "height", "frameborder", "allow", "allowfullscreen", "loading"],
    table: ["border", "cellpadding", "cellspacing"],
    th: ["colspan", "rowspan", "scope"],
    td: ["colspan", "rowspan"],
    div: ["class", "style"],
    span: ["class", "style"],
    figure: ["class"],
    figcaption: ["class"],
  },
  allowedIframeHostnames: ["www.youtube.com", "youtube.com", "player.vimeo.com"],
  allowIframeRelativeUrls: false,
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" }),
    iframe: (tagName, attribs) => {
      if (!attribs.src) return { tagName, attribs: {} };
      const isYouTube = attribs.src.includes("youtube.com") || attribs.src.includes("youtu.be");
      if (!isYouTube) return { tagName: "iframe", attribs };
      const videoId = extractYouTubeId(attribs.src);
      if (!videoId) return { tagName: "iframe", attribs };
      return {
        tagName: "iframe",
        attribs: {
          src: `https://www.youtube.com/embed/${videoId}`,
          width: attribs.width || "560",
          height: attribs.height || "315",
          frameborder: "0",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowfullscreen: "",
          loading: "lazy",
        },
      };
    },
  },
  disallowedTagsMode: "discard",
};

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch.*[?&]v=([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function sanitizeContent(html: string): string {
  return sanitizeHtml(html, sanitizeOptions);
}

export default function RichContent({ html, className }: RichContentProps) {
  if (!html) return null;

  const clean = sanitizeContent(html);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
