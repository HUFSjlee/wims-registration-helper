import { Card, InputMock, PrimaryButton, WebPage } from "./WebScaffold";

export default function WebSignupPersonalPage() {
  return (
    <WebPage title="14 웹 회원가입 (개인)" rightText="로그인으로 이동">
      <div className="grid grid-cols-[1fr_520px] gap-4">
        <Card className="bg-slate-100">
          <h2 className="text-3xl font-bold text-slate-800">개인 회원가입</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-600">
            공통 필수값 입력: 이름, 아이디, 비밀번호, 전화번호, 주소{"\n"}
            검증: 아이디 중복, 비밀번호 정책, 전화번호 형식
          </p>
        </Card>

        <Card className="space-y-2.5">
          <InputMock />
          <InputMock />
          <InputMock />
          <InputMock />
          <InputMock className="h-12" />
          <p className="text-xs text-red-600">전화번호 형식 오류 / 비밀번호 정책 미충족 시 필드별 메시지</p>
          <PrimaryButton>가입 완료 → 로그인</PrimaryButton>
        </Card>
      </div>
    </WebPage>
  );
}
