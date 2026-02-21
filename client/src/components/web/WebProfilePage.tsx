"use client";

import Link from "next/link";
import { WebPage, Card, Button } from "./WebScaffold";

export default function WebProfilePage() {
  return (
    <WebPage
      title="회원 프로필"
      headerLinks={[
        { href: "/web/main", label: "메인" },
        { href: "/web/login", label: "로그아웃" },
      ]}
    >
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <h2 className="mb-3 text-base font-bold text-slate-800">기본 정보</h2>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <dt className="text-slate-500">이름</dt>
            <dd className="text-slate-800">홍길동</dd>
            <dt className="text-slate-500">이메일</dt>
            <dd className="text-slate-800">user@example.com</dd>
            <dt className="text-slate-500">전화번호</dt>
            <dd className="text-slate-800">010-1234-5678</dd>
            <dt className="text-slate-500">주소</dt>
            <dd className="text-slate-800">서울시 강남구 ...</dd>
          </dl>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">보유 개체 목록</h2>
            <Link href="/web/register">
              <Button variant="secondary" className="h-9 w-auto px-4">+ 개체 등록</Button>
            </Link>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between rounded border border-gray-200 px-3 py-2">
              <span>크레스티드 게코 (Correlophus ciliatus)</span>
              <span className="font-medium">3마리</span>
            </div>
            <div className="flex justify-between rounded border border-gray-200 px-3 py-2">
              <span>레오파드 게코 (Eublepharis macularius)</span>
              <span className="font-medium">2마리</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-base font-bold text-slate-800">양도/양수 이력</h2>
          <div className="space-y-2 text-sm text-slate-600">
            <p>최근 양도/양수 내역이 여기에 표시됩니다.</p>
          </div>
        </Card>
      </div>
    </WebPage>
  );
}
