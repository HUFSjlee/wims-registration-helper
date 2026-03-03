"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { WebPage, Card, Input, Button } from "./WebScaffold";
import { useMockAuth } from "../../contexts/MockAuthContext";

export default function WebSignupBusinessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup } = useMockAuth();
  const [error, setError] = useState("");

  const nextPath = searchParams.get("next") || "/web/main";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const passwordConfirm = (form.elements.namedItem("passwordConfirm") as HTMLInputElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const address = (form.elements.namedItem("address") as HTMLInputElement).value;

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    const user = {
      id: `u_${Date.now()}`,
      name,
      email,
      phone,
      address,
    };

    signup(user, password);
    router.push(nextPath);
  };

  return (
    <WebPage
      title="사업자 회원가입"
      headerLinks={[
        { href: `/web/login?next=${encodeURIComponent(nextPath)}`, label: "로그인" },
        { href: `/web/signup?next=${encodeURIComponent(nextPath)}`, label: "회원가입" },
      ]}
    >
      <div className="mx-auto grid max-w-4xl grid-cols-[1fr_460px] gap-6">
        <Card className="bg-orange-50">
          <h2 className="text-lg font-bold text-orange-900">사업자 회원가입</h2>
          <p className="mt-2 text-sm text-orange-800">
            개인 정보에 더해 사업자등록번호, 상호명, 대표자명, 사업장 주소를 입력해 주세요. 자체 회원가입만 지원합니다.
          </p>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-base font-bold text-slate-800">개인 정보</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <Input name="name" label="이름" type="text" placeholder="홍길동" required />
              <Input name="email" label="이메일" type="email" placeholder="example@email.com" required />
              <Input name="password" label="비밀번호" type="password" placeholder="8자 이상" required />
              <Input name="passwordConfirm" label="비밀번호 확인" type="password" placeholder="비밀번호 재입력" required />
              <Input name="phone" label="전화번호" type="tel" placeholder="010-0000-0000" required />
            </div>
            <h2 className="pt-2 text-base font-bold text-slate-800">사업자 정보</h2>
            <div className="space-y-3">
              <Input name="bizNo" label="사업자등록번호" type="text" placeholder="000-00-00000" required />
              <Input name="bizName" label="상호명" type="text" placeholder="(주)회사명" required />
              <Input name="ceoName" label="대표자명" type="text" placeholder="대표자 이름" required />
              <Input name="address" label="사업장 주소" type="text" placeholder="사업장 주소" required />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="pt-2">
              <Button type="submit">사업자 가입 완료</Button>
            </div>
          </form>
          <p className="text-center text-sm text-slate-500">
            <Link href={`/web/signup?next=${encodeURIComponent(nextPath)}`} className="text-blue-600 hover:underline">
              유형 선택으로 돌아가기
            </Link>
          </p>
        </Card>
      </div>
    </WebPage>
  );
}
