"use client";

import { useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { boxApi } from "@/lib/api";
import BoxCard from "@/components/box/BoxCard";
import BoxMap from "@/components/box/BoxMap";
import { Box, Page } from "@/types";
import s from "./boxes.module.css";

const CITIES = ["전체", "서울", "경기", "부산", "인천", "대구", "대전", "광주", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

function BoxesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [keyword, setKeyword] = useState("");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "전체");
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["boxes", selectedCity, keyword, page],
    queryFn: async () => {
      const res = await boxApi.search({
        city: selectedCity === "전체" ? undefined : selectedCity,
        keyword: keyword || undefined,
        page,
        size: 12,
      });
      return res.data.data as Page<Box>;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setPage(0);
    router.push(`/boxes${city !== "전체" ? `?city=${city}` : ""}`, { scroll: false });
  };

  return (
    <div className={s.page}>
      {/* Search Bar */}
      <div className={s.searchBar}>
        <div className={s.searchTop}>
          <form onSubmit={handleSearch} className={s.searchInputWrap}>
            <svg className={s.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="박스 이름, 주소로 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className={s.searchInput}
            />
          </form>

          <div className={s.viewToggle}>
            <button
              onClick={() => setViewMode("list")}
              className={`${s.viewBtn} ${viewMode === "list" ? s.viewBtnActive : ""}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
              목록
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`${s.viewBtn} ${viewMode === "map" ? s.viewBtnActive : ""}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
              </svg>
              지도
            </button>
          </div>
        </div>

        <div className={s.cityPills}>
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => handleCityChange(city)}
              className={`${s.pill} ${selectedCity === city ? s.pillActive : ""}`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={s.content}>
        {viewMode === "map" ? (
          <BoxMap boxes={data?.content || []} />
        ) : (
          <>
            <div className={s.contentHeader}>
              <p className={s.resultCount}>
                총 <span>{data?.totalElements || 0}</span>개 박스
              </p>
            </div>

            {isLoading ? (
              <div className={s.grid}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={s.skeleton} />
                ))}
              </div>
            ) : data?.content.length === 0 ? (
              <div className={s.grid}>
                <div className={s.empty}>
                  <div className={s.emptyIcon}>🏋️</div>
                  <p className={s.emptyText}>검색 결과가 없습니다</p>
                  <p className={s.emptySubText}>다른 검색어나 지역을 시도해보세요</p>
                </div>
              </div>
            ) : (
              <div className={s.grid}>
                {data?.content.map((box) => (
                  <BoxCard key={box.id} box={box} />
                ))}
              </div>
            )}

            {data && data.totalPages > 1 && (
              <div className={s.pagination}>
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={data.first}
                  className="btn-secondary"
                >
                  이전
                </button>
                <span className={s.pageInfo}>{data.number + 1} / {data.totalPages}</span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={data.last}
                  className="btn-secondary"
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function BoxesPage() {
  return (
    <Suspense>
      <BoxesContent />
    </Suspense>
  );
}
