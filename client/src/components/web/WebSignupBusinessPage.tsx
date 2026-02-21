import { Card, InputMock, PrimaryButton, WebPage } from "./WebScaffold";

export default function WebSignupBusinessPage() {
  return (
    <WebPage title="15 웹 회원가입 (사업자)" rightText="유형 선택으로 돌아가기">
      <div className="grid grid-cols-[1fr_540px] gap-4">
        <Card className="bg-orange-50">
          <h2 className="text-3xl font-bold text-orange-900">사업자 회원가입</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-orange-700">
            공통 항목 + 사업자등록번호(필수){"\n"}
            대표자명, 상호명, 사업장 주소까지 입력
          </p>
        </Card>

        <Card className="space-y-2.5">
          <InputMock className="h-9" />
          <InputMock className="h-9" />
          <InputMock className="h-9" />
          <InputMock className="h-9" />
          <InputMock className="h-10 border-orange-300 bg-orange-50" />
          <InputMock className="h-9" />
          <InputMock className="h-12" />
          <p className="text-xs text-red-600">사업자 추가 필수값 누락 시 가입 불가</p>
          <PrimaryButton>사업자 가입 완료</PrimaryButton>
        </Card>
      </div>
    </WebPage>
  );
}
