"use client";

import { useState, useEffect, useCallback } from "react";
import { WebPage, Card, Input, Button } from "./WebScaffold";
import {
  getSpeciesHoldings,
  recordDeath,
  type SpeciesHolding,
} from "../../lib/api";

export default function WebDeathPage() {
  const [holdings, setHoldings] = useState<SpeciesHolding[]>([]);
  const [holdingsLoading, setHoldingsLoading] = useState(true);
  const [holdingsError, setHoldingsError] = useState<string | null>(null);

  const [selectedHolding, setSelectedHolding] = useState<SpeciesHolding | null>(null);
  const [deathQuantity, setDeathQuantity] = useState("");
  const [showMaxQuantityModal, setShowMaxQuantityModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadHoldings = useCallback(async () => {
    setHoldingsLoading(true);
    setHoldingsError(null);
    try {
      const list = await getSpeciesHoldings();
      setHoldings(list);
    } catch (e) {
      console.error(e);
      setHoldingsError(
        e instanceof Error ? e.message : "보유 목록을 불러오지 못했습니다."
      );
      setHoldings([]);
    } finally {
      setHoldingsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHoldings();
  }, [loadHoldings]);

  useEffect(() => {
    setDeathQuantity("");
  }, [selectedHolding?.speciesId]);

  const maxQuantity = selectedHolding?.quantity ?? 0;

  function handleDeathQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const num = value === "" ? NaN : parseInt(value, 10);
    if (!Number.isNaN(num) && selectedHolding && num > selectedHolding.quantity) {
      setDeathQuantity(String(selectedHolding.quantity));
      setShowMaxQuantityModal(true);
      return;
    }
    setDeathQuantity(value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedHolding) return;
    const quantity = deathQuantity.trim();
    if (!quantity) return;
    setSubmitting(true);
    try {
      await recordDeath({
        speciesId: selectedHolding.speciesId,
        quantity,
      });
      setShowSuccessModal(true);
      setSelectedHolding(null);
      setDeathQuantity("");
      await loadHoldings();
    } catch (err) {
      console.error("[WebDeathPage] recordDeath error:", err);
      setShowErrorModal(true);
    } finally {
      setSubmitting(false);
    }
  }

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
          {holdingsLoading && (
            <p className="text-sm text-slate-500">보유 목록을 불러오는 중...</p>
          )}
          {holdingsError && (
            <p className="text-sm text-red-600">{holdingsError}</p>
          )}
          {!holdingsLoading && !holdingsError && holdings.length === 0 && (
            <p className="text-sm text-slate-600">
              등록된 보유 개체가 없습니다. 먼저 개체 등록 후 이용해 주세요.
            </p>
          )}
          <div className="max-h-32 space-y-1 overflow-y-auto rounded border border-gray-200">
            {holdings.map((h) => (
              <button
                key={h.speciesId}
                type="button"
                onClick={() => setSelectedHolding(h)}
                className={`flex w-full justify-between px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                  selectedHolding?.speciesId === h.speciesId ? "bg-blue-50 ring-1 ring-blue-200" : ""
                }`}
              >
                <span>
                  {h.commonName} ({h.scientificName})
                </span>
                <span className="text-slate-500">보유: {h.quantity}</span>
              </button>
            ))}
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs font-medium text-slate-600">선택된 개체</p>
            <p className="text-sm text-slate-800">
              {selectedHolding
                ? `${selectedHolding.commonName} (${selectedHolding.scientificName}) - 현재 보유: ${selectedHolding.quantity}`
                : "목록에서 개체를 선택하세요."}
            </p>
          </div>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <Input
              label="폐사 수량"
              type="number"
              min={1}
              placeholder={maxQuantity ? `1 ~ ${maxQuantity}` : "1"}
              value={deathQuantity}
              onChange={handleDeathQuantityChange}
              required
              disabled={!selectedHolding}
            />
            {showMaxQuantityModal && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                role="alertdialog"
                aria-live="assertive"
              >
                <div className="max-w-sm rounded-xl bg-white p-5 shadow-lg">
                  <p className="text-slate-800">보유수량까지만 입력가능합니다.</p>
                  <button
                    type="button"
                    onClick={() => setShowMaxQuantityModal(false)}
                    className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-bold text-white hover:bg-blue-700"
                  >
                    확인
                  </button>
                </div>
              </div>
            )}
            {showSuccessModal && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                role="alertdialog"
                aria-live="polite"
              >
                <div className="max-w-sm rounded-xl bg-white p-5 shadow-lg">
                  <p className="text-slate-800">정상적으로 폐사처리되었습니다.</p>
                  <button
                    type="button"
                    onClick={() => setShowSuccessModal(false)}
                    className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-bold text-white hover:bg-blue-700"
                  >
                    확인
                  </button>
                </div>
              </div>
            )}
            {showErrorModal && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                role="alertdialog"
                aria-live="assertive"
              >
                <div className="max-w-sm rounded-xl bg-white p-5 shadow-lg">
                  <p className="text-slate-800">
                    폐사처리 중 일시적 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowErrorModal(false)}
                    className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-bold text-white hover:bg-blue-700"
                  >
                    확인
                  </button>
                </div>
              </div>
            )}
            <Button type="submit" disabled={submitting || !selectedHolding}>
              {submitting ? "폐사 처리 중..." : "폐사 처리 완료"}
            </Button>
          </form>
        </Card>
      </div>
    </WebPage>
  );
}
