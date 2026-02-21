"use client";

import Link from "next/link";
import { WebPage, Card, Input, Button } from "./WebScaffold";

export default function WebLoginPage() {
  return (
    <WebPage
      title="로그인"
      headerLinks={[
        { href: "/web/login", label: "로그인" },
        { href: "/web/signup", label: "회원가입" },
      ]}
    >
      <div className="mx-auto grid max-w-4xl grid-cols-[1fr_400px] gap-6">
        <Card className="bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">로그인</h2>
          <p className="mt-2 text-sm text-slate-600">
            이메일과 비밀번호로 로그인합니다. 로그인 성공 시 사용자 세션이 유지됩니다.
          </p>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-base font-bold text-slate-800">로그인</h2>
          <form className="space-y-3">
            <Input label="이메일" type="email" placeholder="example@email.com" required />
            <Input label="비밀번호" type="password" placeholder="비밀번호" required />
            <Button type="submit">로그인</Button>
          </form>
          <p className="text-sm text-blue-700">
            <Link href="/web/signup" className="hover:underline">비회원은 회원가입으로 이동</Link>
          </p>
        </Card>
      </div>
    </WebPage>
  );
}
