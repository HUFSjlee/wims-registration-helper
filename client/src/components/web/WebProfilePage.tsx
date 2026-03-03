"use client";

import Link from "next/link";
import { useMemo } from "react";
import { WebPage, Card, Button } from "./WebScaffold";
import { AuthGuard } from "./AuthGuard";
import { useMockAuth } from "../../contexts/MockAuthContext";
import { getMockHoldings, getMockTransfers } from "../../lib/mock-auth";

export default function WebProfilePage() {
  const { user } = useMockAuth();

  const holdings = useMemo(() => {
    if (!user) return [];
    return getMockHoldings(user.id);
  }, [user]);

  const myTransfers = useMemo(() => {
    if (!user) return [];
    return getMockTransfers().filter(
      (t) => t.transferorId === user.id || t.receiverPhone === user.phone
    );
  }, [user]);

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
              <h2 className="text-base font-bold text-slate-800">보유 개체 목록</h2>
              <Link href="/web/register">
                <Button variant="secondary" className="h-9 w-auto px-4">
                  + 개체 등록
                </Button>
              </Link>
            </div>
            <div className="space-y-2 text-sm">
              {holdings.length === 0 ? (
                <p className="text-slate-500">보유 개체가 없습니다.</p>
              ) : (
                holdings.map((h) => (
                  <div
                    key={h.id}
                    className="flex justify-between rounded border border-gray-200 px-3 py-2"
                  >
                    <span>
                      {h.commonName} ({h.scientificName})
                    </span>
                    <span className="font-medium">{h.quantity}마리</span>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 text-base font-bold text-slate-800">양도/양수 이력</h2>
            <div className="space-y-2 text-sm">
              {myTransfers.length === 0 ? (
                <p className="text-slate-500">양도/양수 이력이 없습니다.</p>
              ) : (
                myTransfers.map((t) => (
                  <div key={t.id} className="rounded border border-gray-200 px-3 py-2">
                    <p>
                      {t.commonName} x {t.quantity} -{" "}
                      {t.status === "PENDING" ? "대기" : "완료"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {t.transferorName} {"->"} {t.receiverPhone}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </WebPage>
    </AuthGuard>
  );
}
