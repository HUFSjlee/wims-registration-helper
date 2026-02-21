import { Card, InputMock, PrimaryButton, WebPage } from "./WebScaffold";

export default function WebLoginPage() {
  return (
    <WebPage
      title="11 웹 로그인"
      headerLinks={[
        { href: "/web/login", label: "로그인" },
        { href: "/web/signup/personal", label: "회원가입" },
      ]}
    >
      <div className="grid grid-cols-[1fr_460px] gap-5">
        <Card className="bg-slate-100">
          <h2 className="text-3xl font-bold text-slate-800">웹 화면 인증 UX</h2>
          <p className="mt-2 text-sm text-slate-600">
            모바일과 동일한 입력 항목을 유지하면서, 데스크탑에서는 좌우 분할 구조로 가독성을 높였습니다.
          </p>
        </Card>

        <Card className="space-y-3">
          <h2 className="text-3xl font-bold text-slate-900">로그인</h2>
          <InputMock />
          <InputMock />
          <PrimaryButton>로그인</PrimaryButton>
          <p className="text-sm text-blue-700">비회원은 회원가입으로 이동</p>
        </Card>
      </div>
    </WebPage>
  );
}
