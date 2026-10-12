import type { MetadataRoute } from "next";

/** Allow crawlers (including Googlebot / Googlebot-Image) to fetch favicons and site assets. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
      },
    ],
  };
}
