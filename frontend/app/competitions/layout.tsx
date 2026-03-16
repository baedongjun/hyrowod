import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "대회 일정",
  description: "전국 크로스핏 대회 일정을 한눈에 확인하세요. 지역별, 레벨별 필터로 나에게 맞는 대회를 찾고 참가 신청하세요.",
  openGraph: {
    title: "대회 일정 | CrossFit Korea",
    description: "전국 크로스핏 대회 일정을 한눈에 확인하세요. 지역별, 레벨별 필터로 나에게 맞는 대회를 찾고 참가 신청하세요.",
    url: "https://crossfitkorea.com/competitions",
  },
  twitter: {
    title: "대회 일정 | CrossFit Korea",
    description: "전국 크로스핏 대회 일정을 한눈에 확인하세요. 지역별, 레벨별 필터로 나에게 맞는 대회를 찾고 참가 신청하세요.",
  },
};

export default function CompetitionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
