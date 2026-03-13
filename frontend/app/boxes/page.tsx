"use client";

import { useState, Suspense, useEffect, useRef } from "react";
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
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "전체");
  const [page, setPage] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(0);
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [keyword]);
  const [showFilters, setShowFilters] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [maxFee, setMaxFee] = useState("");
  const [minRating, setMinRating] = useState("");

  const currentUser = typeof window !== "undefined" ? (() => { try { const u = localStorage.getItem("user"); return u ? JSON.parse(u) : null; } catch { return null; } })() : null;
  const isOwner = currentUser?.role === "ROLE_BOX_OWNER" || currentUser?.role === "ROLE_ADMIN";

  const { data, isLoading } = useQuery({
    queryKey: ["boxes", selectedCity, debouncedKeyword, page, verifiedOnly, premiumOnly, maxFee, minRating],
    queryFn: async () => {
      const res = await boxApi.search({
        city: selectedCity === "전체" ? undefined : selectedCity,
        keyword: debouncedKeyword || undefined,
        page,
        size: 12,
        verified: verifiedOnly ? true : undefined,
        premium: premiumOnly ? true : undefined,
        maxFee: maxFee ? parseInt(maxFee) : undefined,
        minRating: minRating ? parseFloat(minRating) : undefined,
      });
      return res.data.data as Page<Box>;
    },
  });

  const activeFilterCount = [verifiedOnly, premiumOnly, !!maxFee, !!minRating].filter(Boolean).length;

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
          <div className={s.searchInputWrap}>
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
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={s.filterBtn}
            style={{ position: "relative" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            필터
            {activeFilterCount > 0 && (
              <span className={s.filterBadge}>{activeFilterCount}</span>
            )}
          </button>

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

        {showFilters && (
          <div className={s.filterPanel}>
            <div className={s.filterRow}>
              <label className={s.filterCheck}>
                <input type="checkbox" checked={verifiedOnly} onChange={(e) => { setVerifiedOnly(e.target.checked); setPage(0); }} />
                <span>인증 박스만</span>
              </label>
              <label className={s.filterCheck}>
                <input type="checkbox" checked={premiumOnly} onChange={(e) => { setPremiumOnly(e.target.checked); setPage(0); }} />
                <span>프리미엄만</span>
              </label>
            </div>
            <div className={s.filterRow}>
              <div className={s.filterField}>
                <span className={s.filterLabel}>최대 월 회비</span>
                <input
                  type="number"
                  className={s.filterInput}
                  placeholder="예: 150000"
                  value={maxFee}
                  onChange={(e) => { setMaxFee(e.target.value); setPage(0); }}
                />
              </div>
              <div className={s.filterField}>
                <span className={s.filterLabel}>최소 평점</span>
                <select
                  className={s.filterSelect}
                  value={minRating}
                  onChange={(e) => { setMinRating(e.target.value); setPage(0); }}
                >
                  <option value="">전체</option>
                  <option value="3">3.0+</option>
                  <option value="3.5">3.5+</option>
                  <option value="4">4.0+</option>
                  <option value="4.5">4.5+</option>
                </select>
              </div>
              {activeFilterCount > 0 && (
                <button
                  className={s.filterReset}
                  onClick={() => { setVerifiedOnly(false); setPremiumOnly(false); setMaxFee(""); setMinRating(""); setPage(0); }}
                >
                  초기화
                </button>
              )}
            </div>
          </div>
        )}

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

      {/* 박스 등록 유도 배너 */}
      {!isOwner && (
        <div className={s.ownerBanner}>
          <span className={s.ownerBannerText}>박스를 운영 중이신가요?</span>
          <a href="/signup" className={s.ownerBannerLink}>무료로 등록하기 →</a>
        </div>
      )}

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
              <div className={s.emptyWrap}>
                <div className={s.empty}>
                  <div className={s.emptyIcon}>🏋️</div>
                  <p className={s.emptyText}>검색 결과가 없습니다</p>
                  <p className={s.emptySubText}>다른 검색어나 지역을 시도해보세요</p>
                </div>
                <div className={s.registerBanner}>
                  <p className={s.registerBannerTitle}>이 지역에 박스를 운영 중이신가요?</p>
                  <p className={s.registerBannerDesc}>CrossFit Korea에 무료로 등록하고 더 많은 회원과 연결하세요.</p>
                  <a href="/signup" className="btn-primary" style={{ display: "inline-block", marginTop: 16 }}>무료 등록하기</a>
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
