import Link from "next/link";
import { WebPage, Card } from "../../../components/web/WebScaffold";

export default function ReceiveLandingPage() {
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
          <p className="text-sm text-slate-500">
            링크가 없는 경우 <Link href="/web/transfer" className="text-blue-600 hover:underline">양도 접수</Link>에서 링크를 전송받을 수 있습니다.
          </p>
        </Card>
      </div>
    </WebPage>
  );
}
