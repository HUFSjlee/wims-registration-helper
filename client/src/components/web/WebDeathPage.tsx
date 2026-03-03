"use client";

import { useMemo, useState } from "react";
import { WebPage, Card, Input, Button } from "./WebScaffold";
import { AuthGuard } from "./AuthGuard";
import { useMockAuth } from "../../contexts/MockAuthContext";
import {
  getMockHoldings,
  updateMockHoldingQuantity,
  type MockHolding,
} from "../../lib/mock-auth";

export default function WebDeathPage() {
  const { user } = useMockAuth();
  const [selected, setSelected] = useState<MockHolding | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);

  const holdings = useMemo(() => {
    if (!user) return [];
    void refreshTick;
    return getMockHoldings(user.id);
  }, [user, refreshTick]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    if (!selected) {
      setMessage("개체를 선택해 주세요.");
      return;
    }
    if (quantity < 1 || quantity > selected.quantity) {
      setMessage(`수량은 1~${selected.quantity} 사이로 입력해 주세요.`);
      return;
    }
    updateMockHoldingQuantity(selected.id, -quantity);
    setMessage("폐사 처리 완료되었습니다.");
    setSelected(null);
    setQuantity(1);
    setRefreshTick((prev) => prev + 1);
  };

  return (
    <AuthGuard>
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
              보유 개체 중 폐사한 수량을 입력하면 해당 수량만큼 보유 수량에서 차감됩니다.
            </p>
          </Card>

          <Card className="space-y-4">
            <h2 className="text-base font-bold text-slate-800">보유 개체 선택 및 폐사 수량</h2>
            <div className="max-h-32 space-y-1 overflow-y-auto rounded border border-gray-200">
              {holdings.length === 0 ? (
                <p className="px-3 py-2 text-sm text-slate-500">보유 개체가 없습니다.</p>
              ) : (
                holdings.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => {
                      setSelected(h);
                      setQuantity(1);
                    }}
                    className={`flex w-full justify-between px-3 py-2 text-left text-sm ${selected?.id === h.id ? "bg-slate-100" : "hover:bg-slate-50"}`}
                  >
                    <span>
                      {h.commonName} ({h.scientificName})
                    </span>
                    <span className="text-slate-500">보유: {h.quantity}</span>
                  </button>
                ))
              )}
            </div>
            <form className="space-y-3" onSubmit={handleSubmit}>
              {selected && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-medium text-slate-600">선택된 개체</p>
                  <p className="text-sm text-slate-800">
                    {selected.commonName} ({selected.scientificName}) - 현재 보유: {selected.quantity}
                  </p>
                </div>
              )}
              <Input
                label="폐사 수량"
                type="number"
                min={1}
                max={selected?.quantity ?? 1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                required
              />
              {message ? <p className="text-sm text-green-600">{message}</p> : null}
              <Button type="submit" disabled={!selected || holdings.length === 0}>
                폐사 처리 완료
              </Button>
            </form>
          </Card>
        </div>
      </WebPage>
    </AuthGuard>
  );
}
