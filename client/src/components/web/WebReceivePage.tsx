"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, WebPage } from "./WebScaffold";
import { useMockAuth } from "../../contexts/MockAuthContext";
import { getTransfer, submitTransfer, type Transfer } from "../../lib/api";

type Props = { token?: string };

function maskPhone(phone?: string) {
  if (!phone) {
    return "-";
  }
  const normalized = phone.replace(/\D/g, "");
  if (normalized.length < 7) {
    return phone;
  }
  return `${normalized.slice(0, 3)}-****-${normalized.slice(-4)}`;
}

export default function WebReceivePage({ token }: Props) {
  const router = useRouter();
  const { user, isLoading } = useMockAuth();
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [isTransferLoading, setIsTransferLoading] = useState(Boolean(token));
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const nextPath = useMemo(() => {
    if (!token) {
      return "/web/main";
    }
    return `/web/receive/${token}`;
  }, [token]);

  useEffect(() => {
    let active = true;

    async function loadTransfer() {
      if (!token || !user) {
        if (active) {
          setIsTransferLoading(false);
        }
        return;
      }

      try {
        const response = await getTransfer(token);
        if (active) {
          setTransfer(response);
        }
      } catch (error) {
        if (active) {
          setMessage(error instanceof Error ? error.message : "양도 요청을 불러오지 못했습니다.");
          setTransfer(null);
        }
      } finally {
        if (active) {
          setIsTransferLoading(false);
        }
      }
    }

    loadTransfer();

    return () => {
      active = false;
    };
  }, [token, user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      return;
    }

    setMessage("");
    setIsSubmitting(true);

    try {
      await submitTransfer(token);
      setCompleted(true);
      setTimeout(() => router.push("/web/main"), 1500);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "양수 접수 완료 처리에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
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
              양도자로부터 전달받은 링크로 진입해 주세요. 회원가입 또는 로그인 후 같은 링크로 다시 접속하면
              양수 접수를 진행할 수 있습니다.
            </p>
          </Card>
        </div>
      </WebPage>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">사용자 정보를 확인하는 중입니다.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <WebPage title="양수 접수" headerLinks={[{ href: "/web/login", label: "로그인" }]}>
        <div className="mx-auto max-w-lg">
          <Card className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800">로그인이 필요합니다.</h2>
            <p className="text-sm text-slate-600">
              양수 접수는 로그인 상태에서만 가능합니다. 로그인 또는 회원가입 후 현재 링크로 다시 돌아옵니다.
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
          <p className="mt-2 text-sm text-slate-600">메인 화면으로 이동합니다.</p>
        </Card>
      </WebPage>
    );
  }

  if (isTransferLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">양도 요청 정보를 불러오는 중입니다.</p>
      </div>
    );
  }

  if (!transfer) {
    return (
      <WebPage title="양수 접수" headerLinks={[{ href: "/web/main", label: "메인" }]}>
        <Card className="space-y-3">
          <p className="text-slate-700">{message || "유효하지 않거나 조회할 수 없는 양도 요청입니다."}</p>
          <Link href="/web/main" className="text-sm text-blue-600 hover:underline">
            메인으로 이동
          </Link>
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
          <h3 className="text-sm font-bold text-slate-700">양수인 정보</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <p>이름: {user.name}</p>
            <p>전화번호: {user.phone}</p>
            <p>주소: {user.address}</p>
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700">양도 요청 정보</h3>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs text-amber-800">양도인의 주소는 마스킹된 형태로만 표시됩니다.</p>
            <p className="mt-2 text-sm">이름: {transfer.transferorName ?? "-"}</p>
            <p className="text-sm">전화번호: {maskPhone(transfer.transferorPhone)}</p>
            <p className="text-sm">주소: {transfer.maskedTransferorAddress ?? "-"}</p>
          </div>

          <div className="rounded-lg border border-sky-200 bg-sky-50 p-3">
            <p className="text-xs font-medium text-sky-900">양도 개체</p>
            <p className="text-sm text-sky-800">
              {transfer.commonName} ({transfer.scientificName}) x {transfer.speciesQuantity}
            </p>
          </div>

          {message ? <p className="text-sm text-red-600">{message}</p> : null}

          <form onSubmit={handleSubmit}>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "처리 중..." : "신청 (양수 접수 완료)"}
            </Button>
          </form>
        </Card>
      </div>
    </WebPage>
  );
}
