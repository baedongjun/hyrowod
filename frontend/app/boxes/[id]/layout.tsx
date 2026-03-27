import type { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`${API_URL}/api/v1/boxes/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error();
    const json = await res.json();
    const box = json.data;

    const title = box.name ?? "크로스핏 박스";
    const description = box.description
      ? box.description.slice(0, 120)
      : `${box.city ?? ""} ${box.district ?? ""} 위치의 크로스핏 박스. 월 회비 ${box.monthlyFee ? `${box.monthlyFee.toLocaleString()}원` : "문의"}.`;
    const imageUrl = box.thumbnailUrl ?? "/og-image.png";

    return {
      title,
      description,
      openGraph: {
        title: `${title} | HyroWOD`,
        description,
        url: `https://hyrowod.com/boxes/${id}`,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | HyroWOD`,
        description,
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: "크로스핏 박스",
      description: "HyroWOD에서 크로스핏 박스 정보를 확인하세요.",
    };
  }
}

export default function BoxDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
