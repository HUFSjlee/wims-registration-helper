"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { WebPage, Card, Input, Button } from "./WebScaffold";
import { useMockAuth } from "../../contexts/MockAuthContext";

export default function WebSignupPersonalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup, login } = useMockAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = searchParams.get("next") || "/web/main";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const passwordConfirm = (form.elements.namedItem("passwordConfirm") as HTMLInputElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      setIsSubmitting(false);
      return;
    }

    try {
      await signup({
        userType: "PERSONAL",
        name,
        email,
        phone,
        address1: "미입력",
        address2: "",
        address3: "",
        birth: "1900-01-01",
        gender: "UNKNOWN",
        password,
      });

      await login(email, password);
      router.push(nextPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WebPage
      title="개인 회원가입"
      headerLinks={[
        { href: `/web/login?next=${encodeURIComponent(nextPath)}`, label: "로그인" },
        { href: `/web/signup?next=${encodeURIComponent(nextPath)}`, label: "회원가입" },
      ]}
    >
      <div className="mx-auto grid max-w-4xl grid-cols-[1fr_420px] gap-6">
        <Card className="bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">개인 회원가입</h2>
          <p className="mt-2 text-sm text-slate-600">
            이름, 이메일, 비밀번호, 전화번호를 입력해 회원가입합니다.
          </p>
          <p className="mt-2 text-xs text-amber-700">
            주소, 생년월일, 성별은 현재 백엔드 연동을 위해 기본값으로 저장됩니다.
          </p>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-base font-bold text-slate-800">필수 정보 입력</h2>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <Input name="name" label="이름" type="text" placeholder="홍길동" required />
            <Input name="email" label="이메일" type="email" placeholder="example@email.com" required />
            <Input name="password" label="비밀번호" type="password" placeholder="8자 이상" required />
            <Input name="passwordConfirm" label="비밀번호 확인" type="password" placeholder="비밀번호 재입력" required />
            <Input name="phone" label="전화번호" type="tel" placeholder="01012345678" required />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "가입 중..." : "가입 완료"}
              </Button>
            </div>
          </form>
          <p className="text-center text-sm text-slate-500">
            <Link href={`/web/login?next=${encodeURIComponent(nextPath)}`} className="text-blue-600 hover:underline">
              이미 계정이 있으면 로그인
            </Link>
          </p>
        </Card>
      </div>
    </WebPage>
  );
}
