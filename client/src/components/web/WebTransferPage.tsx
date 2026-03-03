"use client";

import { useMemo, useState } from "react";
import { WebPage, Card, Input, Button } from "./WebScaffold";
import { AuthGuard } from "./AuthGuard";
import { useMockAuth } from "../../contexts/MockAuthContext";
import {
  getMockHoldings,
  createMockTransfer,
  type MockHolding,
} from "../../lib/mock-auth";

const COMMON_TO_SCIENTIFIC: Record<string, string> = {
  "크레스티드게코": "Correlophus ciliatus",
  "크레스티드 게코": "Correlophus ciliatus",
  레오파드게코: "Eublepharis macularius",
  "레오파드 게코": "Eublepharis macularius",
  볼파이톤: "Python regius",
  "볼 파이톤": "Python regius",
};

export default function WebTransferPage() {
  const { user } = useMockAuth();
  const [selected, setSelected] = useState<MockHolding | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [receiverPhone, setReceiverPhone] = useState("");
  const [message, setMessage] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);

  const [commonNameInput, setCommonNameInput] = useState("");
  const [lookupResult, setLookupResult] = useState("");

  const holdings: MockHolding[] = useMemo(() => {
    if (!user) return [];
    void refreshTick;
    return getMockHoldings(user.id);
  }, [user, refreshTick]);

  const encodedMessage = useMemo(() => {
    if (!generatedLink) return "";
    return encodeURIComponent(
      `WIMS 양수 접수 링크입니다.\n아래 링크로 접속해 주세요.\n${generatedLink}`
    );
  }, [generatedLink]);

  const handleLookup = () => {
    const key = commonNameInput.trim();
    if (!key) {
      setLookupResult("일반명을 입력해 주세요.");
      return;
    }
    const scientific = COMMON_TO_SCIENTIFIC[key];
    if (!scientific) {
      setLookupResult("매핑된 학명이 없습니다. 개체 등록 시 직접 학명을 입력해 주세요.");
      return;
    }
    setLookupResult(`${key} -> ${scientific}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!user || !selected) {
      setMessage("개체를 선택해 주세요.");
      return;
    }
    if (quantity < 1 || quantity > selected.quantity) {
      setMessage(`수량은 1~${selected.quantity} 사이로 입력해 주세요.`);
      return;
    }
    if (!receiverPhone.trim()) {
      setMessage("양수자 전화번호를 입력해 주세요.");
      return;
    }

    const transfer = createMockTransfer(user, receiverPhone.trim(), selected, quantity);
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/web/receive/${transfer.token}`;
    setGeneratedLink(url);
    void navigator.clipboard.writeText(url);

    setMessage("링크를 생성했습니다. 아래 전송 버튼으로 문자 또는 공유 앱에서 전달해 주세요.");
    setSelected(null);
    setQuantity(1);
    setRefreshTick((prev) => prev + 1);
  };

  if (!user) return null;

  return (
    <AuthGuard>
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
              <p>이름: {user.name}</p>
              <p>전화번호: {user.phone}</p>
              <p>주소: {user.address}</p>
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700">양도할 개체 선택</h3>
            <p className="text-xs text-slate-500">
              보유 개체 목록에서 선택하세요. 개체 등록 화면에서 먼저 등록할 수 있습니다.
            </p>

            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-700">일반명으로 학명 조회</p>
              <div className="flex gap-2">
                <Input
                  label=""
                  type="text"
                  placeholder="예: 크레스티드게코"
                  value={commonNameInput}
                  onChange={(e) => setCommonNameInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleLookup}
                  className="h-10 shrink-0 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  학명 조회
                </button>
              </div>
              {lookupResult ? <p className="text-xs text-slate-600">{lookupResult}</p> : null}
            </div>

            <div className="max-h-32 space-y-1 overflow-y-auto rounded border border-gray-200">
              {holdings.length === 0 ? (
                <p className="px-3 py-2 text-sm text-slate-500">보유 개체가 없습니다. 개체 등록을 먼저 해 주세요.</p>
              ) : (
                holdings.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setSelected(h)}
                    className={`flex w-full justify-between px-3 py-2 text-left text-sm ${selected?.id === h.id ? "bg-blue-100" : "hover:bg-blue-50"}`}
                  >
                    <span>
                      {h.commonName} ({h.scientificName})
                    </span>
                    <span className="text-slate-500">x{h.quantity}</span>
                  </button>
                ))
              )}
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
              {selected && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <p className="text-xs font-medium text-blue-900">선택된 개체</p>
                  <p className="text-sm text-blue-800">
                    {selected.commonName} ({selected.scientificName})
                  </p>
                </div>
              )}

              <Input
                label="양도 수량"
                type="number"
                min={1}
                max={selected?.quantity ?? 1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                required
              />
              <Input
                label="양수자 전화번호"
                type="tel"
                placeholder="010-0000-0000"
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                required
              />

              {message ? <p className="text-sm text-green-600">{message}</p> : null}

              {generatedLink ? (
                <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-700">생성된 양수 링크</p>
                  <p className="break-all text-xs text-slate-600">{generatedLink}</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`sms:${receiverPhone.replace(/\s/g, "")}?body=${encodedMessage}`}
                      className="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      문자(SMS) 전송
                    </a>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!navigator.share) {
                          setMessage("현재 브라우저에서 공유 기능을 지원하지 않습니다. 문자 버튼을 이용해 주세요.");
                          return;
                        }
                        await navigator.share({
                          title: "WIMS 양수 접수 링크",
                          text: "WIMS 양수 접수 링크입니다.",
                          url: generatedLink,
                        });
                      }}
                      className="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      카카오/앱 공유
                    </button>
                  </div>
                </div>
              ) : null}

              <Button type="submit" disabled={!selected || holdings.length === 0}>
                링크 생성하기
              </Button>
            </form>
          </Card>
        </div>
      </WebPage>
    </AuthGuard>
  );
}
