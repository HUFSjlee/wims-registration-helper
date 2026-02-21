"use client";

import Link from "next/link";
import { WebPage, Card, Input, Button } from "./WebScaffold";

export default function WebRegisterPage() {
  return (
    <WebPage
      title="개체 등록 (보관)"
      headerLinks={[
        { href: "/web/main", label: "메인" },
        { href: "/web/profile", label: "프로필" },
      ]}
    >
      <div className="mx-auto grid max-w-4xl grid-cols-[1fr_420px] gap-6">
        <Card className="bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">개체 등록</h2>
          <p className="mt-2 text-sm text-slate-600">
            보유한 생물 개체를 등록합니다. 학명(scientific name), 일반명, 수량을 입력하면 해당 회원의 보유 목록에 저장됩니다.
          </p>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-base font-bold text-slate-800">등록 정보</h2>
          <form className="space-y-3">
            <Input label="학명 (scientific name)" type="text" placeholder="예: Correlophus ciliatus" required />
            <Input label="일반명" type="text" placeholder="예: 크레스티드 게코" />
            <Input label="수량" type="number" min={1} placeholder="1" required />
            <div className="pt-2">
              <Button type="submit">등록 완료</Button>
            </div>
          </form>
          <p className="text-sm text-slate-500">
            일반명 입력 시 학명 자동 매핑이 지원됩니다. (예: &quot;크레스티드게코&quot; → Correlophus ciliatus)
          </p>
        </Card>
      </div>
    </WebPage>
  );
}
