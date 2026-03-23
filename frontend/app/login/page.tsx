"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { authApi } from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import s from "../auth.module.css";

const schema = z.object({
  email: z.string().email("올바른 이메일을 입력해주세요."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authApi.login(data);
      saveAuth(res.data.data);
      toast.success("로그인되었습니다.");
      router.push("/");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || "로그인에 실패했습니다.");
    }
  };

  return (
    <div className={s.page}>
      <div className={s.wrap}>
        <div className={s.logoWrap}>
          <span className={s.logo}><span>CF</span>KOREA</span>
          <p className={s.pageTitle}>로그인</p>
        </div>

        <div className={s.card}>
          <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
            <div className={s.field}>
              <label className={s.label}>이메일</label>
              <input
                type="email"
                {...register("email")}
                placeholder="example@email.com"
                className="input-field"
                autoComplete="email"
              />
              {errors.email && <p className={s.error}>{errors.email.message}</p>}
            </div>

            <div className={s.field}>
              <label className={s.label}>비밀번호</label>
              <input
                type="password"
                {...register("password")}
                placeholder="비밀번호 입력"
                className="input-field"
                autoComplete="current-password"
              />
              {errors.password && <p className={s.error}>{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className={`btn-primary ${s.submitBtn}`}>
              {isSubmitting ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <div className={s.divider}>
            <span>또는</span>
          </div>

          <div className={s.socialButtons}>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/kakao`}
              className={s.socialBtn}
              style={{ background: "#FEE500", color: "#191919" }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1.5C4.86 1.5 1.5 4.13 1.5 7.38c0 2.07 1.38 3.88 3.45 4.94l-.88 3.27 3.83-2.53c.36.05.72.07 1.1.07 4.14 0 7.5-2.63 7.5-5.88S13.14 1.5 9 1.5z" fill="#191919"/>
              </svg>
              카카오로 로그인
            </a>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/google`}
              className={s.socialBtn}
              style={{ background: "#fff", color: "#3c4043", border: "1px solid #dadce0" }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Google로 로그인
            </a>
          </div>

          <p className={s.footer}>
            <Link href="/forgot-password" className={s.footerLink}>비밀번호를 잊으셨나요?</Link>
          </p>
          <p className={s.footer}>
            계정이 없으신가요?{" "}
            <Link href="/signup" className={s.footerLink}>회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
