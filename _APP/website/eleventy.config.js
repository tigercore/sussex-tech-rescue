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
