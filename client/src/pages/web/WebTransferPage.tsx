import { Card, InputMock, PrimaryButton, WebPage } from "./WebScaffold";

export default function WebTransferPage() {
  return (
    <WebPage title="12 웹 양도 신청" rightText="양도 신청 | 양수 신청 | 증식 | 폐사">
      <div className="grid grid-cols-[360px_1fr] gap-4">
        <Card className="space-y-3 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-700">양도자 정보 (자동 채움)</h3>
          <InputMock className="h-9" />
          <InputMock className="h-9" />
          <InputMock className="h-9" />
        </Card>

        <Card className="space-y-3">
          <h3 className="text-sm font-bold text-slate-700">개체 정보 선택/자동채움</h3>
          <button
            type="button"
            className="flex h-14 w-full items-center justify-center rounded-lg border border-blue-300 bg-blue-100 px-3 text-center text-xs text-blue-900"
          >
            크레스티드 게코 (crested gecko) : 볏도마뱀붙이 (Correlophus ciliatus)
          </button>
          <div className="h-24 rounded-lg border border-sky-200 bg-sky-50" />
          <InputMock className="h-9 border-indigo-300 bg-indigo-50" />
          <InputMock className="h-9" />
          <InputMock className="h-11" />
          <p className="text-xs text-slate-600">마지막 단계: 양수인 전화번호 입력</p>
          <InputMock className="h-10 border-orange-300 bg-orange-50" />
          <PrimaryButton>SMS 이어하기 링크 전송</PrimaryButton>
        </Card>
      </div>
    </WebPage>
  );
}
