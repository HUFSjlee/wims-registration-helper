"use client";

import Link from "next/link";
import { WebPage, Card, Input, Button } from "./WebScaffold";

const MOCK_HOLDINGS = [
  { id: "1", commonName: "크레스티드 게코", scientificName: "Correlophus ciliatus", quantity: 3 },
  { id: "2", commonName: "레오파드 게코", scientificName: "Eublepharis macularius", quantity: 2 },
];

export default function WebTransferPage() {
  return (
    <WebPage
      title="양도 접수"
      headerLinks={[
        { href: "/web/main", label: "메인" },
        { href: "/web/receive", label: "양수 접수" },
      ]}
    >
      <div className="mx-auto grid max-w-5xl grid-cols-[360px_1fr] gap-6">
        <Card className="space-y-4 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-700">양도자 정보 (자동 채움)</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <p>이름: (로그인 사용자)</p>
            <p>전화번호: (로그인 사용자)</p>
            <p>주소: (로그인 사용자)</p>
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700">양도할 개체 선택</h3>
          <p className="text-xs text-slate-500">
            보유 개체 목록에서 선택하거나, 학명/일반명으로 검색할 수 있습니다. 일반명 입력 시 학명 자동 매핑.
          </p>
          <Input label="학명 또는 일반명 검색" type="text" placeholder="예: 크레스티드게코, Correlophus" />
          <div className="max-h-32 space-y-1 overflow-y-auto rounded border border-gray-200">
            {MOCK_HOLDINGS.map((h) => (
              <button
                key={h.id}
                type="button"
                className="flex w-full justify-between px-3 py-2 text-left text-sm hover:bg-blue-50"
              >
                <span>{h.commonName} ({h.scientificName})</span>
                <span className="text-slate-500">×{h.quantity}</span>
              </button>
            ))}
          </div>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-xs font-medium text-blue-900">선택된 개체</p>
            <p className="text-sm text-blue-800">크레스티드 게코 (Correlophus ciliatus)</p>
          </div>
          <Input label="양도 수량" type="number" min={1} placeholder="1" required />
          <Input label="양수자 전화번호" type="tel" placeholder="010-0000-0000" required />
          <Button>전송하기 (카카오톡/문자 링크 전송)</Button>
        </Card>
      </div>
    </WebPage>
  );
}
