import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/my/", "/login", "/signup", "/boxes/create", "/boxes/*/edit"],
      },
    ],
    sitemap: "https://hyrowod.com/sitemap.xml",
    host: "https://hyrowod.com",
  };
}
