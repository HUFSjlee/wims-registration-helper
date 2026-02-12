import { Card, WebPage } from "./WebScaffold";

function Tab({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      type="button"
      className={[
        "flex h-10 w-full items-center justify-center rounded-lg text-sm font-bold",
        active ? "bg-blue-700 text-white" : "bg-gray-200 text-slate-700",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export default function WebMainPage() {
  return (
    <WebPage title="16 웹 메인">
      <div className="mb-3 flex justify-end">
        <button type="button" className="h-9 rounded-full bg-gray-200 px-4 text-xs font-bold text-slate-700">
          프로필
        </button>
      </div>

      <div className="mb-3 grid grid-cols-4 gap-2 rounded-xl border border-gray-300 bg-gray-200 p-2">
        <Tab label="양도 신청" active />
        <Tab label="양수 신청" />
        <Tab label="증식" />
        <Tab label="폐사" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="min-h-[420px]">
          <h3 className="mb-2 text-base font-bold text-slate-900">빠른 작업</h3>
          <ul className="space-y-1 text-sm text-slate-600">
            <li>• 등록(보유/증식)</li>
            <li>• 폐사</li>
            <li>• 양도/양수 조회 및 접수</li>
          </ul>
        </Card>
        <Card className="min-h-[420px]">
          <h3 className="mb-2 text-base font-bold text-slate-900">최근 진행 현황</h3>
          <div className="h-[170px] rounded-lg border border-gray-300 bg-gray-50" />
        </Card>
      </div>
    </WebPage>
  );
}
