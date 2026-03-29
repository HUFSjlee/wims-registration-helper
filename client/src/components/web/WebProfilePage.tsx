"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthGuard } from "./AuthGuard";
import { Button, Card, WebPage } from "./WebScaffold";
import { useMockAuth } from "../../contexts/MockAuthContext";
import {
  getMyTransfers,
  getSpeciesHoldings,
  type SpeciesHolding,
  type TransferSummary,
} from "../../lib/api";

export default function WebProfilePage() {
  const { user } = useMockAuth();
  const [holdings, setHoldings] = useState<SpeciesHolding[]>([]);
  const [transfers, setTransfers] = useState<TransferSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfileData() {
      try {
        const [holdingsResponse, transfersResponse] = await Promise.all([
          getSpeciesHoldings(),
          getMyTransfers(),
        ]);

        if (active) {
          setHoldings(holdingsResponse);
          setTransfers(transfersResponse);
        }
      } catch (fetchError) {
        if (active) {
          setError(fetchError instanceof Error ? fetchError.message : "프로필 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadProfileData();

    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthGuard>
      <WebPage title="회원 프로필" headerLinks={[{ href: "/web/main", label: "메인" }]}>
        <div className="mx-auto max-w-4xl space-y-6">
          <Card>
            <h2 className="mb-3 text-base font-bold text-slate-800">기본 정보</h2>
            {user && (
              <dl className="grid gap-2 text-sm sm:grid-cols-2">
                <dt className="text-slate-500">이름</dt>
                <dd className="text-slate-800">{user.name}</dd>
                <dt className="text-slate-500">이메일</dt>
                <dd className="text-slate-800">{user.email}</dd>
                <dt className="text-slate-500">전화번호</dt>
                <dd className="text-slate-800">{user.phone}</dd>
                <dt className="text-slate-500">주소</dt>
                <dd className="text-slate-800">{user.address}</dd>
              </dl>
            )}
          </Card>

          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800">보유 개체 현황</h2>
              <Link href="/web/register">
                <Button variant="secondary" className="h-9 w-auto px-4">
                  + 개체 등록
                </Button>
              </Link>
            </div>
            <div className="space-y-2 text-sm">
              {isLoading ? (
                <p className="text-slate-500">보유 개체 현황을 불러오는 중입니다.</p>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : holdings.length === 0 ? (
                <p className="text-slate-500">보유 개체가 없습니다.</p>
              ) : (
                holdings.map((holding) => (
                  <div
                    key={holding.speciesId}
                    className="flex justify-between rounded border border-gray-200 px-3 py-2"
                  >
                    <span>
                      {holding.commonName} ({holding.scientificName})
                    </span>
                    <span className="font-medium">{holding.quantity}마리</span>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 text-base font-bold text-slate-800">양도/양수 이력</h2>
            <div className="space-y-2 text-sm">
              {isLoading ? (
                <p className="text-slate-500">양도/양수 이력을 불러오는 중입니다.</p>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : transfers.length === 0 ? (
                <p className="text-slate-500">양도/양수 이력이 없습니다.</p>
              ) : (
                transfers.map((transfer) => {
                  const isTransferOut = String(transfer.transferorId) === user?.id;

                  return (
                    <div
                      key={transfer.transferId}
                      className="rounded border border-gray-200 px-3 py-2"
                    >
                      <p>
                        [{isTransferOut ? "양도" : "양수"}] {transfer.commonName} ({transfer.scientificName}) x{" "}
                        {transfer.speciesQuantity}
                      </p>
                      <p className="text-xs text-slate-500">
                        상태: {transfer.completed ? "완료" : "대기"} / 키: {transfer.transferKey}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </WebPage>
    </AuthGuard>
  );
}
