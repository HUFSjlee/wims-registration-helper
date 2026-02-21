"use client";

import Link from "next/link";
import { WebPage, Card, Button } from "./WebScaffold";

const tabs = [
  { href: "/web/transfer", label: "양도 접수" },
  { href: "/web/receive", label: "양수 접수" },
  { href: "/web/register", label: "개체 등록" },
  { href: "/web/death", label: "폐사 처리" },
  { href: "/web/profile", label: "프로필" },
];

export default function WebMainPage() {
  return (
    <WebPage
      title="WIMS 등록 도우미"
      headerLinks={[
        { href: "/web/login", label: "로그아웃" },
        { href: "/web/profile", label: "프로필" },
      ]}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {tabs.map((tab) => (
            <Link key={tab.href} href={tab.href}>
              <Button variant="outline" className="h-12">
                {tab.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <h3 className="mb-2 text-base font-bold text-slate-800">빠른 작업</h3>
            <ul className="space-y-1 text-sm text-slate-600">
              <li>• 개체 등록 (보유/증식)</li>
              <li>• 폐사 처리</li>
              <li>• 양도 접수 (링크 전송)</li>
              <li>• 양수 접수 (링크 진입)</li>
            </ul>
          </Card>
          <Card>
            <h3 className="mb-2 text-base font-bold text-slate-800">최근 진행 현황</h3>
            <p className="text-sm text-slate-500">양도/양수 이력이 여기에 표시됩니다.</p>
          </Card>
        </div>
      </div>
    </WebPage>
  );
}
