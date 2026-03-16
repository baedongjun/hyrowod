import { MetadataRoute } from "next";

const BASE_URL = "https://crossfitkorea.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}`,             lastModified: new Date(), priority: 1.0, changeFrequency: "daily" },
    { url: `${BASE_URL}/boxes`,        lastModified: new Date(), priority: 0.9, changeFrequency: "daily" },
    { url: `${BASE_URL}/wod`,          lastModified: new Date(), priority: 0.8, changeFrequency: "daily" },
    { url: `${BASE_URL}/competitions`, lastModified: new Date(), priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE_URL}/community`,    lastModified: new Date(), priority: 0.7, changeFrequency: "daily" },
  ];

  let boxPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/v1/boxes?size=200&sort=createdAt,desc`, {
      next: { revalidate: 86400 },
    });
    if (res.ok) {
      const json = await res.json();
      boxPages = (json.data?.content ?? []).map((box: { id: number; updatedAt?: string }) => ({
        url: `${BASE_URL}/boxes/${box.id}`,
        lastModified: box.updatedAt ? new Date(box.updatedAt) : new Date(),
        priority: 0.7,
        changeFrequency: "weekly" as const,
      }));
    }
  } catch { /* API 미응답 시 정적 페이지만 반환 */ }

  let compPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/v1/competitions?size=200`, {
      next: { revalidate: 86400 },
    });
    if (res.ok) {
      const json = await res.json();
      compPages = (json.data?.content ?? []).map((comp: { id: number }) => ({
        url: `${BASE_URL}/competitions/${comp.id}`,
        lastModified: new Date(),
        priority: 0.6,
        changeFrequency: "weekly" as const,
      }));
    }
  } catch { /* ignore */ }

  return [...staticPages, ...boxPages, ...compPages];
}
