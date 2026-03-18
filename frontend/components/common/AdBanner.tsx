"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { advertisementApi } from "@/lib/api";
import s from "./AdBanner.module.css";

interface AdBannerProps {
  position?: "BANNER" | "SIDEBAR" | "COMMUNITY" | "BOXES";
}

interface Ad {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  position: string;
}

export default function AdBanner({ position = "BANNER" }: AdBannerProps) {
  const { data: ads } = useQuery({
    queryKey: ["advertisements", position],
    queryFn: async () => (await advertisementApi.getAds(position)).data.data as Ad[],
    staleTime: 1000 * 60 * 5,
  });

  if (!ads || ads.length === 0) return null;

  const ad = ads[0];

  const content = (
    <div className={s.banner}>
      {ad.imageUrl ? (
        <div className={s.imgWrap}>
          <Image src={ad.imageUrl} alt={ad.title} fill style={{ objectFit: "cover" }} />
        </div>
      ) : (
        <div className={s.textBanner}>
          <span className={s.adLabel}>AD</span>
          <span className={s.adTitle}>{ad.title}</span>
          {ad.description && <span className={s.adDesc}>{ad.description}</span>}
        </div>
      )}
    </div>
  );

  if (ad.linkUrl) {
    return (
      <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer sponsored" className={s.link}>
        {content}
      </a>
    );
  }

  return content;
}
