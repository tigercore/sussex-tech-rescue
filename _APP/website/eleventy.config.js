import fs from "node:fs";

const iconCache = {};

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addWatchTarget("src/assets/photos/");

  // {% photo "name", "alt text", "shape" %} shows src/assets/photos/name.jpg once it exists,
  // and a soft placeholder until then. Shapes: landscape, portrait, square.
  eleventyConfig.addShortcode("photo", (name, alt, shape = "landscape") => {
    const ext = ["jpg", "jpeg", "png", "webp"].find((e) => fs.existsSync(`src/assets/photos/${name}.${e}`));
    if (ext) {
      return `<img class="photo photo-${shape}" src="/assets/photos/${name}.${ext}" alt="${alt}" loading="lazy" decoding="async">`;
    }
    return `<div class="photo photo-${shape} photo-placeholder" role="img" aria-label="${alt}"><span>Photo to come<br><small>${alt}</small></span></div>`;
  });

  // {% icon "name" %} inlines an SVG from src/_includes/icons.
  eleventyConfig.addShortcode("icon", (name) => {
    if (!iconCache[name]) {
      const file = `src/_includes/icons/${name}.svg`;
      if (!fs.existsSync(file)) throw new Error(`Missing icon: ${name}`);
      iconCache[name] = fs
        .readFileSync(file, "utf8")
        .replace(/<!--.*?-->\s*/s, "")
        .replace(/\s*\n\s*/g, " ")
        .replace("<svg ", '<svg aria-hidden="true" focusable="false" ');
    }
    return iconCache[name];
  });

  // Stop widows: join the last two words of text blocks with a non-breaking space.
  const widowTags = /<(p|li|h1|h2|h3|summary|figcaption|blockquote)(\s[^>]*)?>([\s\S]*?)<\/\1>/g;
  eleventyConfig.addTransform("no-widows", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    return content.replace(widowTags, (match, tag, attrs = "", inner) => {
      const words = inner.replace(/<[^>]+>/g, " ").trim().split(/\s+/);
      if (words.length < 4) return match;
      const fixed = inner.replace(/([^\s>])\s+([^\s<>]+(?:<\/[a-z]+>)*\s*)$/i, "$1&nbsp;$2");
      return `<${tag}${attrs}>${fixed}</${tag}>`;
    });
  });

  // Umami analytics: tag every call-to-action link with a click event, plus the page and the
  // part of the page it sits in, e.g. Call · page "/about/" · location "header".
  const ctaEvents = [
    [/^tel:/, "Call"],
    [/^https:\/\/wa\.me\//, "WhatsApp"],
    [/^mailto:/, "Email"],
    [/#book$/, "Book a visit"],
    [/^#family-book$/, "Choose a plan"],
    [/^#plans$/, "See plans"],
    [/^\/remote-help\/$/, "Remote help"],
    [/^https:\/\/(www\.)?(splashtop|teamviewer|apps\.apple|play\.google|my\.splashtop)\./, "Download remote app"],
  ];
  const ctaLocations = [
    ['class="topbar', "top bar"], ["<header", "header"], ['class="ticker', "header"], ['class="mobile-bar', "mobile bar"],
    ["<footer", "footer"], ['class="hero', "hero"], ['class="cta-band', "call to action band"],
  ];
  // A section is named by its id or aria-labelledby, or failing that by its first heading
  const sectionName = (attrs, body) => {
    const id = attrs.match(/(?:aria-labelledby|id)="([^"]+)"/);
    const aliases = { book: "booking form", "family book": "family form" };
    if (id) { const n = id[1].replace(/-heading$/, "").replace(/-/g, " "); return aliases[n] || n; }
    const h = body.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/);
    return h ? h[1].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim().toLowerCase().slice(0, 40) : "content";
  };
  const escapeAttr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  eleventyConfig.addTransform("umami-cta-events", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    const pageUrl = this.page.url;
    const sections = [...content.matchAll(/<section\b([^>]*)>/g)].map((m) => ({ at: m.index, name: sectionName(m[1], content.slice(m.index, m.index + 4000)) }));
    return content.replace(/<a\s([^>]*?)href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/g, (match, before, href, after, inner, offset) => {
      if (/data-umami-event=/.test(before + after)) return match;
      const hit = ctaEvents.find(([re]) => re.test(href));
      if (!hit) return match;
      // Where on the page: the latest landmark or section that opened before this link
      let location = "content", at = -1;
      for (const [marker, name] of ctaLocations) {
        const i = content.lastIndexOf(marker, offset);
        if (i > at) { at = i; location = name; }
      }
      for (const s of sections) if (s.at < offset && s.at > at) { at = s.at; location = s.name; }
      if (hit[1] === "Remote help" && !/class="[^"]*\bbtn\b/.test(before + after) && location !== "top bar") return match;
      const heading = inner.match(/<h3[^>]*>([\s\S]*?)<\/h3>/);
      const label = (heading ? heading[1] : inner).replace(/<svg[\s\S]*?<\/svg>/g, "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().slice(0, 100);
      const plan = (before + after).match(/data-plan="([^"]*)"/);
      const attrs = ` data-umami-event="${hit[1]}" data-umami-event-page="${escapeAttr(pageUrl)}" data-umami-event-location="${escapeAttr(location)}" data-umami-event-label="${escapeAttr(label)}"` + (plan ? ` data-umami-event-plan="${plan[1]}"` : "");
      return `<a ${before}href="${href}"${after}${attrs}>${inner}</a>`;
    });
  });

  eleventyConfig.addFilter("year", () => new Date().getFullYear());
  eleventyConfig.addFilter("gbp", (n) => `£${n}`);
  eleventyConfig.addFilter("findBySlug", (list, slug) => list.find((item) => item.slug === slug));
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md"],
  };
}
