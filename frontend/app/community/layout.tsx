import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "커뮤니티",
  description: "크로스핏 커뮤니티에서 자유롭게 소통하세요. 운동 팁, 식단, 장비 후기, WOD 인증 등 다양한 이야기를 나눠보세요.",
  openGraph: {
    title: "커뮤니티 | CrossFit Korea",
    description: "크로스핏 커뮤니티에서 자유롭게 소통하세요. 운동 팁, 식단, 장비 후기, WOD 인증 등 다양한 이야기를 나눠보세요.",
    url: "https://crossfitkorea.com/community",
  },
  twitter: {
    title: "커뮤니티 | CrossFit Korea",
    description: "크로스핏 커뮤니티에서 자유롭게 소통하세요. 운동 팁, 식단, 장비 후기, WOD 인증 등 다양한 이야기를 나눠보세요.",
  },
};

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
