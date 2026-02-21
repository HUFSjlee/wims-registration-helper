"use client";

import Link from "next/link";
import { WebPage, Card, Input, Button } from "./WebScaffold";

const MOCK_HOLDINGS = [
  { id: "1", commonName: "크레스티드 게코", scientificName: "Correlophus ciliatus", quantity: 3 },
  { id: "2", commonName: "레오파드 게코", scientificName: "Eublepharis macularius", quantity: 2 },
];

export default function WebDeathPage() {
  return (
    <WebPage
      title="폐사 처리"
      headerLinks={[
        { href: "/web/main", label: "메인" },
        { href: "/web/profile", label: "프로필" },
      ]}
    >
      <div className="mx-auto grid max-w-4xl grid-cols-[1fr_400px] gap-6">
        <Card className="bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">폐사 처리</h2>
          <p className="mt-2 text-sm text-slate-600">
            보유 개체 중 폐사한 수량을 입력하면 해당 수량만큼 보유 수량에서 차감됩니다. 수량 입력만으로 단순 처리됩니다.
          </p>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-base font-bold text-slate-800">보유 개체 선택 및 폐사 수량</h2>
          <div className="max-h-32 space-y-1 overflow-y-auto rounded border border-gray-200">
            {MOCK_HOLDINGS.map((h) => (
              <button
                key={h.id}
                type="button"
                className="flex w-full justify-between px-3 py-2 text-left text-sm hover:bg-slate-50"
              >
                <span>{h.commonName} ({h.scientificName})</span>
                <span className="text-slate-500">보유: {h.quantity}</span>
              </button>
            ))}
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs font-medium text-slate-600">선택된 개체</p>
            <p className="text-sm text-slate-800">크레스티드 게코 (Correlophus ciliatus) - 현재 보유: 3</p>
          </div>
          <form className="space-y-3">
            <Input label="폐사 수량" type="number" min={1} placeholder="1" required />
            <Button type="submit">폐사 처리 완료</Button>
          </form>
        </Card>
      </div>
    </WebPage>
  );
}
