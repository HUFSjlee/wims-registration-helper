"use client";

import { useState } from "react";
import { WebPage, Card, Input, Button } from "./WebScaffold";
import { AuthGuard } from "./AuthGuard";
import { useMockAuth } from "../../contexts/MockAuthContext";
import { addMockHolding } from "../../lib/mock-auth";

export default function WebRegisterPage() {
  const { user } = useMockAuth();
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    if (!user) return;
    const form = e.currentTarget;
    const scientificName = (form.elements.namedItem("scientificName") as HTMLInputElement).value.trim();
    const commonName = (form.elements.namedItem("commonName") as HTMLInputElement).value.trim();
    const quantity = Number((form.elements.namedItem("quantity") as HTMLInputElement).value) || 1;
    if (!scientificName) {
      setMessage("학명을 입력해 주세요.");
      return;
    }
    if (quantity < 1) {
      setMessage("수량은 1 이상이어야 합니다.");
      return;
    }
    addMockHolding({
      commonName: commonName || scientificName,
      scientificName,
      quantity,
      userId: user.id,
    });
    setMessage("등록 완료되었습니다.");
    form.reset();
  };

  return (
    <AuthGuard>
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
            <form className="space-y-3" onSubmit={handleSubmit}>
              <Input name="scientificName" label="학명 (scientific name)" type="text" placeholder="예: Correlophus ciliatus" required />
              <Input name="commonName" label="일반명" type="text" placeholder="예: 크레스티드 게코" />
              <Input name="quantity" label="수량" type="number" min={1} placeholder="1" required />
              {message ? <p className="text-sm text-green-600">{message}</p> : null}
              <div className="pt-2">
                <Button type="submit">등록 완료</Button>
              </div>
            </form>
          </Card>
        </div>
      </WebPage>
    </AuthGuard>
  );
}
