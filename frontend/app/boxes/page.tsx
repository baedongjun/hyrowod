"use client";

import { useState, Suspense, useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { boxApi } from "@/lib/api";
import BoxCard from "@/components/box/BoxCard";
import BoxMap from "@/components/box/BoxMap";
import { Box, Page } from "@/types";
import s from "./boxes.module.css";

const CITIES = ["전체", "서울", "경기", "부산", "인천", "대구", "대전", "광주", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

function BoxesContent() {
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [debouncedKeyword, setDebouncedKeyword] = useState(searchParams.get("q") || "");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "전체");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // 최근 검색어
  const RECENT_KEY = "box_recent_searches";
  const getRecentSearches = (): string[] => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
  };
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  useEffect(() => { setRecentSearches(getRecentSearches()); }, []);
  const saveRecentSearch = (q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...getRecentSearches().filter((s) => s !== q)].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    setRecentSearches(updated);
  };
  const removeRecentSearch = (q: string) => {
    const updated = getRecentSearches().filter((s) => s !== q);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    setRecentSearches(updated);
  };
  const [sortBy, setSortBy] = useState("createdAt,desc");

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [keyword]);

  const currentUser = typeof window !== "undefined" ? (() => { try { const u = localStorage.getItem("user"); return u ? JSON.parse(u) : null; } catch { return null; } })() : null;
  const isOwner = currentUser?.role === "ROLE_BOX_OWNER" || currentUser?.role === "ROLE_ADMIN";

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["boxes", "infinite", selectedCity, debouncedKeyword, sortBy],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await boxApi.search({
        city: selectedCity === "전체" ? undefined : selectedCity,
        keyword: debouncedKeyword || undefined,
        page: pageParam as number,
        size: 12,
        sort: sortBy,
      });
      return res.data.data as Page<Box>;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.number + 1;
    },
  });

  const allBoxes = data?.pages.flatMap((p) => p.content) ?? [];
  const totalElements = data?.pages[0]?.totalElements ?? 0;

  // 지도 모드 전용: verified 박스 전체 조회 (페이지네이션 없이 최대 500개)
  const { data: mapBoxesData } = useQuery({
    queryKey: ["boxes", "map", selectedCity, debouncedKeyword],
    queryFn: async () => {
      const res = await boxApi.search({
        city: selectedCity === "전체" ? undefined : selectedCity,
        keyword: debouncedKeyword || undefined,
        verified: true,
        page: 0,
        size: 500,
        sort: "createdAt,desc",
      });
      return (res.data.data as Page<Box>).content;
    },
    enabled: viewMode === "map",
    staleTime: 1000 * 60 * 5,
  });
  const mapBoxes = mapBoxesData ?? [];

  // IntersectionObserver for infinite scroll (list mode only)
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    if (viewMode !== "list") return;
    const el = observerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver, viewMode]);

  // 자동완성: 키워드가 2자 이상일 때 suggestions
  const { data: suggestData } = useQuery({
    queryKey: ["boxes", "suggest", keyword],
    queryFn: async () => {
      const res = await boxApi.search({ keyword, size: 5 });
      return (res.data.data as Page<Box>).content || [];
    },
    enabled: keyword.length >= 2,
  });

  const suggestions: Box[] = keyword.length >= 2 ? (suggestData || []) : [];

  // 외부 클릭 시 suggestions 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };

  return (
    <div className={s.page}>
      {/* Search Bar */}
      <div className={s.searchBar}>
        <div className={s.searchTop}>
          <div className={s.searchInputWrap} ref={searchWrapRef} style={{ position: "relative" }}>
            <svg className={s.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="박스 이름, 주소로 검색"
              value={keyword}
              onChange={(e) => { setKeyword(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              className={s.searchInput}
            />
            {showSuggestions && (suggestions.length > 0 || (!keyword && recentSearches.length > 0)) && (
              <div className={s.suggestions}>
                {!keyword && recentSearches.length > 0 && (
                  <>
                    <div className={s.suggestionLabel}>최근 검색어</div>
                    {recentSearches.map((q) => (
                      <button
                        key={q}
                        className={s.suggestionItem}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setKeyword(q);
                          setDebouncedKeyword(q);
                          setShowSuggestions(false);
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, color: "var(--muted)" }}>
                          <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.4"/>
                        </svg>
                        <span>{q}</span>
                        <span
                          style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)", padding: "0 4px" }}
                          onMouseDown={(e) => { e.stopPropagation(); removeRecentSearch(q); }}
                        >✕</span>
                      </button>
                    ))}
                  </>
                )}
                {suggestions.map((box) => (
                  <button
                    key={box.id}
                    className={s.suggestionItem}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setKeyword(box.name);
                      setDebouncedKeyword(box.name);
                      setShowSuggestions(false);
                      saveRecentSearch(box.name);
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, color: "var(--muted)" }}>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                    </svg>
                    <span>{box.name}</span>
                    <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: "auto" }}>{box.city}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

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

      {/* 박스 등록 유도 배너 */}
      {!isOwner && (
        <div className={s.ownerBanner}>
          <span className={s.ownerBannerText}>박스를 운영 중이신가요?</span>
          <Link href="/boxes/create" className={s.ownerBannerLink}>무료로 등록하기 →</Link>
        </div>
      )}

      {/* Content */}
      <div className={s.content}>
        {viewMode === "map" ? (
          <BoxMap boxes={mapBoxes} />
        ) : (
          <>
            <div className={s.contentHeader}>
              <p className={s.resultCount}>
                총 <span>{totalElements}</span>개 박스
              </p>
              <select
                className={s.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="createdAt,desc">최신순</option>
                <option value="rating,desc">별점 높은순</option>
                <option value="reviewCount,desc">후기 많은순</option>
                <option value="monthlyFee,asc">회비 낮은순</option>
                <option value="monthlyFee,desc">회비 높은순</option>
              </select>
            </div>

            {isLoading ? (
              <div className={s.grid}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={s.skeleton} />
                ))}
              </div>
            ) : allBoxes.length === 0 ? (
              <div className={s.emptyWrap}>
                <div className={s.empty}>
                  <div className={s.emptyIcon}>🏋️</div>
                  <p className={s.emptyText}>검색 결과가 없습니다</p>
                  <p className={s.emptySubText}>다른 검색어나 지역을 시도해보세요</p>
                </div>
                <div className={s.registerBanner}>
                  <p className={s.registerBannerTitle}>이 지역에 박스를 운영 중이신가요?</p>
                  <p className={s.registerBannerDesc}>HyroWOD에 무료로 등록하고 더 많은 회원과 연결하세요.</p>
                  <Link href="/boxes/create" className="btn-primary" style={{ display: "inline-block", marginTop: 16 }}>무료 등록하기</Link>
                </div>
              </div>
            ) : (
              <div className={s.grid}>
                {allBoxes.map((box) => (
                  <BoxCard key={box.id} box={box} />
                ))}
              </div>
            )}

            {/* Infinite scroll sentinel */}
            <div ref={observerRef} className={s.infiniteSentinel}>
              {isFetchingNextPage && <span className={s.loadingText}>로딩 중...</span>}
            </div>
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
