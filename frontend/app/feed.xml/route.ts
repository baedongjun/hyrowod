import { NextResponse } from "next/server";
import { Post } from "@/types";

const BASE_URL = "https://hyrowod.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const CATEGORY_LABEL: Record<string, string> = {
  FREE: "자유",
  QNA: "Q&A",
  RECORD: "기록",
  MARKET: "장터",
};

export async function GET() {
  let posts: Post[] = [];
  try {
    const res = await fetch(
      `${API_URL}/api/v1/community/posts?size=20&sort=createdAt,desc`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const json = await res.json();
      posts = json.data?.content ?? [];
    }
  } catch { /* API 미응답 시 빈 피드 반환 */ }

  const items = posts
    .map((post) => {
      const category = CATEGORY_LABEL[post.category] ?? post.category;
      const description = post.content
        .replace(/<[^>]*>/g, "")
        .slice(0, 200)
        .trim();
      const pubDate = new Date(post.createdAt).toUTCString();

      return `
    <item>
      <title><![CDATA[[${category}] ${post.title}]]></title>
      <link>${BASE_URL}/community/${post.id}</link>
      <guid isPermaLink="true">${BASE_URL}/community/${post.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <author><![CDATA[${post.userName}]]></author>
      <category><![CDATA[${category}]]></category>
      <description><![CDATA[${description}${post.content.length > 200 ? "..." : ""}]]></description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>HyroWOD 커뮤니티</title>
    <link>${BASE_URL}/community</link>
    <description>전국 크로스핏·하이록스 커뮤니티 최신 게시글 — 자유, Q&amp;A, 기록, 장터</description>
    <language>ko</language>
    <ttl>60</ttl>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${BASE_URL}/hyrowod-icon.png</url>
      <title>HyroWOD</title>
      <link>${BASE_URL}</link>
    </image>${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
