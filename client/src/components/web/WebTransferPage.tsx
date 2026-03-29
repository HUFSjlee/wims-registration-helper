"use client";

import { useEffect, useMemo, useState } from "react";
import { AuthGuard } from "./AuthGuard";
import { Button, Card, Input, WebPage } from "./WebScaffold";
import { useMockAuth } from "../../contexts/MockAuthContext";
import { createTransfer, getSpeciesHoldings, type SpeciesHolding } from "../../lib/api";

function buildReceiveLink(transferKey?: string) {
  if (!transferKey || typeof window === "undefined") {
    return "";
  }
  return `${window.location.origin}/web/receive/${transferKey}`;
}

export default function WebTransferPage() {
  const { user } = useMockAuth();
  const [holdings, setHoldings] = useState<SpeciesHolding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [transfereePhone, setTransfereePhone] = useState("");
  const [message, setMessage] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  useEffect(() => {
    let active = true;

    async function loadHoldings() {
      try {
        const response = await getSpeciesHoldings();
        if (active) {
          setHoldings(response);
        }
      } catch (error) {
        if (active) {
          setMessage(error instanceof Error ? error.message : "보유 개체 목록을 불러오지 못했습니다.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadHoldings();

    return () => {
      active = false;
    };
  }, []);

  const selectedHolding = useMemo(() => {
    if (selectedSpeciesId == null) {
      return null;
    }
    return holdings.find((holding) => holding.speciesId === selectedSpeciesId) ?? null;
  }, [holdings, selectedSpeciesId]);

  const encodedMessage = useMemo(() => {
    if (!generatedLink) {
      return "";
    }
    return encodeURIComponent(
      `WIMS 양수 접수 링크입니다.\n아래 링크로 접속해 주세요.\n${generatedLink}`
    );
  }, [generatedLink]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!selectedHolding) {
      setMessage("양도할 개체를 먼저 선택해 주세요.");
      return;
    }

    if (quantity < 1 || quantity > selectedHolding.quantity) {
      setMessage(`양도 수량은 1부터 ${selectedHolding.quantity}까지 입력할 수 있습니다.`);
      return;
    }

    if (!transfereePhone.trim()) {
      setMessage("양수자 전화번호를 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const transfer = await createTransfer({
        speciesId: selectedHolding.speciesId,
        scientificName: selectedHolding.scientificName,
        commonName: selectedHolding.commonName,
        speciesQuantity: quantity,
        transfereePhone: transfereePhone.trim(),
      });

      const receiveLink = buildReceiveLink(transfer.transferKey);
      setGeneratedLink(receiveLink);
      setMessage("양도 요청이 생성되었습니다. 아래 링크를 양수자에게 전달해 주세요.");

      if (receiveLink && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(receiveLink);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "양도 요청 생성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

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
            <h3 className="text-sm font-bold text-slate-700">양도자 정보</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p>이름: {user.name}</p>
              <p>전화번호: {user.phone}</p>
              <p>주소: {user.address}</p>
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700">양도할 개체 선택</h3>
            <p className="text-xs text-slate-500">
              현재 보유 중인 개체 목록에서 양도할 대상을 선택한 뒤, 양수자 전화번호를 입력합니다.
            </p>

            <div className="max-h-40 space-y-1 overflow-y-auto rounded border border-gray-200">
              {isLoading ? (
                <p className="px-3 py-2 text-sm text-slate-500">보유 개체 목록을 불러오는 중입니다.</p>
              ) : holdings.length === 0 ? (
                <p className="px-3 py-2 text-sm text-slate-500">보유 개체가 없습니다.</p>
              ) : (
                holdings.map((holding) => (
                  <button
                    key={holding.speciesId}
                    type="button"
                    onClick={() => {
                      setSelectedSpeciesId(holding.speciesId);
                      setQuantity(1);
                    }}
                    className={`flex w-full justify-between px-3 py-2 text-left text-sm ${
                      selectedSpeciesId === holding.speciesId ? "bg-blue-100" : "hover:bg-blue-50"
                    }`}
                  >
                    <span>
                      {holding.commonName} ({holding.scientificName})
                    </span>
                    <span className="text-slate-500">x{holding.quantity}</span>
                  </button>
                ))
              )}
            </div>

            <form className="space-y-3" onSubmit={handleSubmit}>
              {selectedHolding ? (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <p className="text-xs font-medium text-blue-900">선택된 개체</p>
                  <p className="text-sm text-blue-800">
                    {selectedHolding.commonName} ({selectedHolding.scientificName})
                  </p>
                </div>
              ) : null}

              <Input
                label="양도 수량"
                type="number"
                min={1}
                max={selectedHolding?.quantity ?? 1}
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value) || 1)}
                required
              />

              <Input
                label="양수자 전화번호"
                type="tel"
                placeholder="01012345678"
                value={transfereePhone}
                onChange={(event) => setTransfereePhone(event.target.value)}
                required
              />

              {message ? <p className="text-sm text-slate-700">{message}</p> : null}

              {generatedLink ? (
                <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-700">생성된 양수 링크</p>
                  <p className="break-all text-xs text-slate-600">{generatedLink}</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`sms:${transfereePhone.replace(/\s/g, "")}?body=${encodedMessage}`}
                      className="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      문자 전송
                    </a>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!navigator.share) {
                          setMessage("현재 브라우저에서는 공유 기능을 지원하지 않습니다.");
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
                      공유하기
                    </button>
                  </div>
                </div>
              ) : null}

              <Button type="submit" disabled={isSubmitting || !selectedHolding || holdings.length === 0}>
                {isSubmitting ? "전송 중..." : "전송하기"}
              </Button>
            </form>
          </Card>
        </div>
      </WebPage>
    </AuthGuard>
  );
}
