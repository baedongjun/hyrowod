import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "박스 찾기",
  description: "전국 크로스핏·하이록스 박스를 지도와 목록으로 검색하세요. 지역별 필터, 평점, 월 회비 정보를 한눈에 확인할 수 있습니다.",
  openGraph: {
    title: "박스 찾기 | HyroWOD",
    description: "전국 크로스핏·하이록스 박스를 지도와 목록으로 검색하세요. 지역별 필터, 평점, 월 회비 정보를 한눈에 확인할 수 있습니다.",
    url: "https://hyrowod.com/boxes",
  },
  twitter: {
    title: "박스 찾기 | HyroWOD",
    description: "전국 크로스핏·하이록스 박스를 지도와 목록으로 검색하세요. 지역별 필터, 평점, 월 회비 정보를 한눈에 확인할 수 있습니다.",
  },
};

export default function BoxesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
