"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import { boxApi } from "@/lib/api";
import { isLoggedIn } from "@/lib/auth";
import { toast } from "react-toastify";
import s from "../../create/create.module.css";

const CITIES = ["서울", "경기", "부산", "인천", "대구", "대전", "광주", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];

export default function BoxEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [form, setForm] = useState({
    name: "", address: "", city: "서울", district: "", phone: "",
    website: "", instagram: "", youtube: "", description: "",
    monthlyFee: "", openTime: "06:00", closeTime: "22:00",
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) router.replace("/login");
  }, []);

  const { data: box } = useQuery({
    queryKey: ["box", id],
    queryFn: async () => (await boxApi.getOne(id)).data.data,
    enabled: !!id,
  });

  useEffect(() => {
    if (box && !loaded) {
      setForm({
        name: box.name || "",
        address: box.address || "",
        city: box.city || "서울",
        district: box.district || "",
        phone: box.phone || "",
        website: box.website || "",
        instagram: box.instagram || "",
        youtube: box.youtube || "",
        description: box.description || "",
        monthlyFee: box.monthlyFee ? String(box.monthlyFee) : "",
        openTime: box.openTime || "06:00",
        closeTime: box.closeTime || "22:00",
      });
      setLoaded(true);
    }
  }, [box, loaded]);

  const mutation = useMutation({
    mutationFn: () =>
      boxApi.update(id, {
        ...form,
        monthlyFee: form.monthlyFee ? parseInt(form.monthlyFee) : null,
      }),
    onSuccess: () => {
      toast.success("박스 정보가 수정되었습니다.");
      router.push(`/boxes/${id}`);
    },
    onError: () => toast.error("수정에 실패했습니다."),
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim()) {
      toast.error("박스 이름과 주소는 필수입니다.");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className={s.page}>
      <div className={s.content}>
        <Link href={`/boxes/${id}`} className={s.back}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          박스 상세
        </Link>

        <div className={s.header}>
          <p className={s.tag}>BOX EDIT</p>
          <h1 className={s.title}>박스 정보 수정</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={s.section}>
            <p className={s.sectionTitle}>기본 정보</p>
            <div className={s.grid2}>
              <div className={s.field}>
                <label className={s.label}>박스 이름 <span className={s.required}>*</span></label>
                <input className="input-field" value={form.name} onChange={set("name")} />
              </div>
              <div className={s.field}>
                <label className={s.label}>전화번호</label>
                <input className="input-field" value={form.phone} onChange={set("phone")} />
              </div>
            </div>
            <div className={s.field}>
              <label className={s.label}>주소 <span className={s.required}>*</span></label>
              <input className="input-field" value={form.address} onChange={set("address")} />
            </div>
            <div className={s.grid2}>
              <div className={s.field}>
                <label className={s.label}>지역 <span className={s.required}>*</span></label>
                <select className={s.select} value={form.city} onChange={set("city")}>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className={s.field}>
                <label className={s.label}>구/군</label>
                <input className="input-field" value={form.district} onChange={set("district")} />
              </div>
            </div>
          </div>

          <div className={s.section}>
            <p className={s.sectionTitle}>운영 정보</p>
            <div className={s.grid3}>
              <div className={s.field}>
                <label className={s.label}>월 회비 (원)</label>
                <input className="input-field" type="number" value={form.monthlyFee} onChange={set("monthlyFee")} />
              </div>
              <div className={s.field}>
                <label className={s.label}>오픈 시간</label>
                <input className="input-field" type="time" value={form.openTime} onChange={set("openTime")} />
              </div>
              <div className={s.field}>
                <label className={s.label}>마감 시간</label>
                <input className="input-field" type="time" value={form.closeTime} onChange={set("closeTime")} />
              </div>
            </div>
          </div>

          <div className={s.section}>
            <p className={s.sectionTitle}>소셜 & 링크</p>
            <div className={s.grid2}>
              <div className={s.field}>
                <label className={s.label}>웹사이트</label>
                <input className="input-field" value={form.website} onChange={set("website")} />
              </div>
              <div className={s.field}>
                <label className={s.label}>인스타그램</label>
                <input className="input-field" value={form.instagram} onChange={set("instagram")} />
              </div>
            </div>
            <div className={s.field}>
              <label className={s.label}>유튜브</label>
              <input className="input-field" value={form.youtube} onChange={set("youtube")} />
            </div>
          </div>

          <div className={s.section}>
            <p className={s.sectionTitle}>박스 소개</p>
            <div className={s.field}>
              <label className={s.label}>소개글</label>
              <textarea className={s.textarea} value={form.description} onChange={set("description")} />
            </div>
          </div>

          <div className={s.actions}>
            <Link href={`/boxes/${id}`} className="btn-secondary" style={{ padding: "15px 32px" }}>취소</Link>
            <button type="submit" className="btn-primary" disabled={mutation.isPending}>
              {mutation.isPending ? "저장 중..." : "수정 완료"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
