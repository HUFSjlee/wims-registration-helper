"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { WebPage, Card, Button } from "../../../components/web/WebScaffold";

export default function SignupTypePage() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/web/main";
  const nextQuery = `next=${encodeURIComponent(nextPath)}`;

  return (
    <WebPage
      title="회원가입"
      headerLinks={[{ href: `/web/login?${nextQuery}`, label: "로그인" }]}
    >
      <div className="mx-auto max-w-lg space-y-6">
        <Card className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800">가입 유형 선택</h2>
          <p className="text-sm text-slate-600">
            개인 또는 사업자 회원가입을 선택해 주세요. 소셜 로그인은 지원하지 않으며 자체 회원가입만 가능합니다.
          </p>
          <div className="grid gap-3">
            <Link href={`/web/signup/personal?${nextQuery}`}>
              <Button variant="primary">개인 회원가입</Button>
            </Link>
            <Link href={`/web/signup/business?${nextQuery}`}>
              <Button variant="outline">사업자 회원가입</Button>
            </Link>
          </div>
        </Card>
      </div>
    </WebPage>
  );
}
