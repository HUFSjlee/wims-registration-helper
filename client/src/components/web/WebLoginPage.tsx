"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { WebPage, Card, Input, Button } from "./WebScaffold";
import { useMockAuth } from "../../contexts/MockAuthContext";

export default function WebLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useMockAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = searchParams.get("next") || "/web/main";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const success = await login(email, password);

    if (success) {
      router.push(nextPath);
    } else {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    setIsSubmitting(false);
  };

  return (
    <WebPage
      title="로그인"
      headerLinks={[
        { href: `/web/login?next=${encodeURIComponent(nextPath)}`, label: "로그인" },
        { href: `/web/signup?next=${encodeURIComponent(nextPath)}`, label: "회원가입" },
      ]}
    >
      <div className="mx-auto grid max-w-4xl grid-cols-[1fr_400px] gap-6">
        <Card className="bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">로그인</h2>
          <p className="mt-2 text-sm text-slate-600">
            이메일과 비밀번호로 로그인합니다. 로그인 성공 시 기존 진행 화면으로 이동합니다.
          </p>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-base font-bold text-slate-800">로그인</h2>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <Input name="email" label="이메일" type="email" placeholder="example@email.com" required />
            <Input name="password" label="비밀번호" type="password" placeholder="비밀번호" required />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "로그인 중..." : "로그인"}
            </Button>
          </form>
          <p className="text-sm text-blue-700">
            <Link href={`/web/signup?next=${encodeURIComponent(nextPath)}`} className="hover:underline">
              회원가입으로 이동
            </Link>
          </p>
        </Card>
      </div>
    </WebPage>
  );
}
