import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "오늘의 WOD",
  description: "매일 업데이트되는 WOD(Workout of the Day)를 확인하고 내 기록을 등록하세요. 리더보드에서 다른 회원들과 비교해보세요.",
  openGraph: {
    title: "오늘의 WOD | HyroWOD",
    description: "매일 업데이트되는 WOD(Workout of the Day)를 확인하고 내 기록을 등록하세요. 리더보드에서 다른 회원들과 비교해보세요.",
    url: "https://hyrowod.com/wod",
  },
  twitter: {
    title: "오늘의 WOD | HyroWOD",
    description: "매일 업데이트되는 WOD(Workout of the Day)를 확인하고 내 기록을 등록하세요. 리더보드에서 다른 회원들과 비교해보세요.",
  },
};

export default function WodLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
