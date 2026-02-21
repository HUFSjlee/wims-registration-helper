"use client";

import Link from "next/link";
import { WebPage, Card, Button } from "./WebScaffold";

type Props = { token?: string };

export default function WebReceivePage({ token }: Props) {
  return (
    <WebPage
      title="양수 접수"
      headerLinks={[
        { href: "/web/main", label: "메인" },
        { href: "/web/transfer", label: "양도 접수" },
      ]}
    >
      <div className="mx-auto grid max-w-5xl grid-cols-[360px_1fr] gap-6">
        <Card className="space-y-4 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-700">양수인 정보 (자동 입력)</h3>
          <p className="text-xs text-slate-500">로그인한 회원의 본인 정보가 자동으로 채워집니다.</p>
          <div className="space-y-2 text-sm text-slate-600">
            <p>이름: (본인)</p>
            <p>전화번호: (본인)</p>
            <p>주소: (본인)</p>
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700">양도인 정보 (주소 마스킹)</h3>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs text-amber-800">양도인의 정보가 표시됩니다. 주소는 마스킹 처리됩니다.</p>
            <p className="mt-2 text-sm">이름: 양***</p>
            <p className="text-sm">전화번호: 010-****-5678</p>
            <p className="text-sm">주소: 서울시 ***구 ***동 ***</p>
          </div>
          <div className="rounded-lg border border-sky-200 bg-sky-50 p-3">
            <p className="text-xs font-medium text-sky-900">양도 개체</p>
            <p className="text-sm text-sky-800">크레스티드 게코 (Correlophus ciliatus) × 1</p>
          </div>
          <p className="text-xs text-slate-500">
            비회원인 경우 회원가입 후 링크를 다시 진입해 주세요. 내용 확인 후 신청 버튼을 클릭하면 양수 접수가 완료됩니다.
          </p>
          <Button>신청 (양수 접수 완료)</Button>
        </Card>
      </div>
    </WebPage>
  );
}
