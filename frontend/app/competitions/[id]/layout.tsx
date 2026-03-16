import type { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`${API_URL}/api/v1/competitions/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error();
    const json = await res.json();
    const comp = json.data;

    const title = comp.name ?? "크로스핏 대회";
    const dateStr = comp.startDate ? `${comp.startDate} 개최` : "";
    const locationStr = comp.location ? `📍 ${comp.location}` : "";
    const description = [dateStr, locationStr, comp.description?.slice(0, 80)]
      .filter(Boolean)
      .join(" · ");

    return {
      title,
      description: description || "CrossFit Korea에서 대회 정보를 확인하세요.",
      openGraph: {
        title: `${title} | CrossFit Korea`,
        description: description || "CrossFit Korea에서 대회 정보를 확인하세요.",
        url: `https://crossfitkorea.com/competitions/${id}`,
        images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | CrossFit Korea`,
        description: description || "CrossFit Korea에서 대회 정보를 확인하세요.",
        images: ["/og-image.png"],
      },
    };
  } catch {
    return {
      title: "대회 정보",
      description: "CrossFit Korea에서 크로스핏 대회 정보를 확인하세요.",
    };
  }
}

export default function CompetitionDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
