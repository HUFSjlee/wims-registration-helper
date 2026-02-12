import { Card, InputMock, PrimaryButton, WebPage } from "./WebScaffold";

export default function WebReceivePage() {
  return (
    <WebPage title="13 웹 양수 신청" rightText="링크 진입 후 작성">
      <div className="grid grid-cols-[360px_1fr] gap-4">
        <Card className="space-y-3 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-700">양수인 정보 입력</h3>
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
          <InputMock className="h-9 border-indigo-300 bg-indigo-50" />
          <InputMock className="h-9" />
          <InputMock className="h-11" />
          <div className="rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-xs text-green-800">
            <p className="font-bold">양수자 정보 확인 완료</p>
            <p>양도자에게 진행 알림 전송</p>
          </div>
          <PrimaryButton>환경부(WIMS) 신청 페이지로 이동</PrimaryButton>
        </Card>
      </div>
    </WebPage>
  );
}
