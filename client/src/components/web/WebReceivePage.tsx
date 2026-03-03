"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { WebPage, Card, Button } from "./WebScaffold";
import { useMockAuth } from "../../contexts/MockAuthContext";
import {
  getMockTransferByToken,
  completeMockTransfer,
  type MockTransfer,
} from "../../lib/mock-auth";

function maskAddress(addr: string) {
  if (!addr || addr.length < 4) return "***";
  return addr.slice(0, 2) + "***" + addr.slice(-2);
}

function maskPhone(phone: string) {
  if (!phone || phone.length < 8) return "***-****-****";
  const s = phone.replace(/\D/g, "");
  if (s.length >= 10) return s.slice(0, 3) + "-****-" + s.slice(-4);
  return "***-****-****";
}

type Props = { token?: string };

export default function WebReceivePage({ token }: Props) {
  const router = useRouter();
  const { user } = useMockAuth();
  const [completed, setCompleted] = useState(false);

  const nextPath = useMemo(() => {
    if (!token) return "/web/main";
    return `/web/receive/${token}`;
  }, [token]);

  const transfer: MockTransfer | null = useMemo(() => {
    if (!token) return null;
    return getMockTransferByToken(token);
  }, [token]);
  const notFound = Boolean(token && !transfer);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !transfer || transfer.status !== "PENDING") return;
    completeMockTransfer(transfer.token, user.id);
    setCompleted(true);
    setTimeout(() => router.push("/web/main"), 1500);
  };

  if (!token) {
    return (
      <WebPage
        title="양수 접수"
        headerLinks={[
          { href: "/web/main", label: "메인" },
          { href: "/web/login", label: "로그인" },
        ]}
      >
        <div className="mx-auto max-w-lg">
          <Card className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800">양수 접수</h2>
            <p className="text-sm text-slate-600">
              양도자에게 전송받은 링크를 클릭하여 진입해 주세요. 비회원인 경우 회원가입 후 링크를 다시 열어주세요.
            </p>
          </Card>
        </div>
      </WebPage>
    );
  }

  if (notFound) {
    return (
      <WebPage title="양수 접수" headerLinks={[{ href: "/web/main", label: "메인" }]}>
        <Card>
          <p className="text-slate-600">유효하지 않거나 만료된 링크입니다.</p>
          <Link href="/web/main" className="mt-2 inline-block text-blue-600 hover:underline">
            메인으로
          </Link>
        </Card>
      </WebPage>
    );
  }

  if (!transfer) {
    return <div className="flex min-h-screen items-center justify-center">로딩 중...</div>;
  }

  if (!user) {
    return (
      <WebPage title="양수 접수" headerLinks={[{ href: "/web/login", label: "로그인" }]}>
        <div className="mx-auto max-w-lg">
          <Card className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800">회원가입 또는 로그인 필요</h2>
            <p className="text-sm text-slate-600">
              양수 접수는 회원 상태에서만 가능합니다. 회원가입 또는 로그인 후 현재 링크로 다시 돌아옵니다.
            </p>
            <div className="flex gap-2">
              <Link
                href={`/web/signup?next=${encodeURIComponent(nextPath)}`}
                className="inline-flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
              >
                회원가입
              </Link>
              <Link
                href={`/web/login?next=${encodeURIComponent(nextPath)}`}
                className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                로그인
              </Link>
            </div>
          </Card>
        </div>
      </WebPage>
    );
  }

  if (completed) {
    return (
      <WebPage title="양수 접수" headerLinks={[{ href: "/web/main", label: "메인" }]}>
        <Card>
          <p className="text-lg font-bold text-green-600">양수 접수가 완료되었습니다.</p>
          <p className="mt-2 text-sm text-slate-600">메인으로 이동합니다...</p>
        </Card>
      </WebPage>
    );
  }

  return (
    <WebPage
      title="양수 접수"
      headerLinks={[
        { href: "/web/main", label: "메인" },
        { href: "/web/transfer", label: "양도 접수" },
      ]}
    >
      <div className="mx-auto grid max-w-5xl grid-cols-[360px_1fr] gap-6">
        <Card className="space-y-4 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-700">양수인 정보 (자동 입력)</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <p>이름: {user.name}</p>
            <p>전화번호: {user.phone}</p>
            <p>주소: {user.address}</p>
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700">양도인 정보 (주소 마스킹)</h3>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs text-amber-800">양도인의 정보가 표시됩니다. 주소는 마스킹 처리됩니다.</p>
            <p className="mt-2 text-sm">이름: {transfer.transferorName}</p>
            <p className="text-sm">전화번호: {maskPhone(transfer.transferorPhone)}</p>
            <p className="text-sm">주소: {maskAddress(transfer.transferorAddress)}</p>
          </div>
          <div className="rounded-lg border border-sky-200 bg-sky-50 p-3">
            <p className="text-xs font-medium text-sky-900">양도 개체</p>
            <p className="text-sm text-sky-800">
              {transfer.commonName} ({transfer.scientificName}) x {transfer.quantity}
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <Button type="submit">신청 (양수 접수 완료)</Button>
          </form>
        </Card>
      </div>
    </WebPage>
  );
}
