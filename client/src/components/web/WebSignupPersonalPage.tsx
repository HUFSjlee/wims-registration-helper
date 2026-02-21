"use client";

import Link from "next/link";
import { WebPage, Card, Input, Button } from "./WebScaffold";

export default function WebSignupPersonalPage() {
  return (
    <WebPage
      title="개인 회원가입"
      headerLinks={[
        { href: "/web/login", label: "로그인" },
        { href: "/web/signup", label: "회원가입" },
      ]}
    >
      <div className="mx-auto grid max-w-4xl grid-cols-[1fr_420px] gap-6">
        <Card className="bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">개인 회원가입</h2>
          <p className="mt-2 text-sm text-slate-600">
            이름, 이메일, 비밀번호, 전화번호를 입력해 주세요. 자체 회원가입만 지원하며, 소셜 로그인(네이버, 카카오)은 제공하지 않습니다.
          </p>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-base font-bold text-slate-800">필수 정보 입력</h2>
          <form className="space-y-3">
            <Input label="이름" type="text" placeholder="홍길동" required />
            <Input label="이메일" type="email" placeholder="example@email.com" required />
            <Input label="비밀번호" type="password" placeholder="8자 이상" required />
            <Input label="비밀번호 확인" type="password" placeholder="비밀번호 재입력" required />
            <Input label="전화번호" type="tel" placeholder="010-0000-0000" required />
            <div className="pt-2">
              <Button type="submit">가입 완료 → 로그인</Button>
            </div>
          </form>
          <p className="text-center text-sm text-slate-500">
            <Link href="/web/login" className="text-blue-600 hover:underline">이미 계정이 있으신가요? 로그인</Link>
          </p>
        </Card>
      </div>
    </WebPage>
  );
}
