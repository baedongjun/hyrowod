import type { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`${API_URL}/api/v1/community/posts/${id}`, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error();
    const json = await res.json();
    const post = json.data;

    const title = post.title ?? "커뮤니티 게시글";
    const description = post.content
      ? post.content.replace(/\n/g, " ").slice(0, 120)
      : "HyroWOD 커뮤니티 게시글입니다.";
    const author = post.authorName ? `${post.authorName} 작성` : "";

    return {
      title,
      description: author ? `${author} · ${description}` : description,
      openGraph: {
        title: `${title} | HyroWOD`,
        description: author ? `${author} · ${description}` : description,
        url: `https://hyrowod.com/community/${id}`,
        type: "article",
        images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | HyroWOD`,
        description: author ? `${author} · ${description}` : description,
        images: ["/og-image.png"],
      },
    };
  } catch {
    return {
      title: "커뮤니티",
      description: "HyroWOD 커뮤니티에서 소통하세요.",
    };
  }
}

export default function PostDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
