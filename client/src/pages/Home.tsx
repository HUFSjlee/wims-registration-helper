import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type TabKey = "등록" | "폐사" | "양도/양수" | "프로필";

export default function Home() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("양도/양수");

  const tabs: TabKey[] = useMemo(() => ["등록", "폐사", "양도/양수", "프로필"], []);

  return (
    <div className="app page">
      <header className="page-header page-head">
        <div>
          <h2 className="page-title">WIMS Helper</h2>
          <p className="page-subtitle">파충류 양수/양도/등록 서비스</p>
        </div>
        <button onClick={() => navigate("/login")} className="btn btn-ghost">
          로그인
        </button>
      </header>

      {/* 상단 탭 */}
      <div className="tab-bar">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`tab-btn ${tab === t ? "tab-btn--active" : ""}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <main className="page-body">
        {tab === "등록" && (
          <Card title="등록(보유/증식)">
            <p className="muted">프로토타입 단계: 등록 화면은 다음 단계에서 붙입니다.</p>
            <button className="btn btn-primary" disabled>
              등록하러 가기
            </button>
          </Card>
        )}

        {tab === "폐사" && (
          <Card title="폐사 신고">
            <p className="muted">선택된 개체 폐사신고 플로우는 다음 단계에서 붙입니다.</p>
            <button className="btn btn-primary" disabled>
              폐사 신고하기
            </button>
          </Card>
        )}

        {tab === "양도/양수" && (
          <>
            <Card title="양도/양수 (조회/접수)">
              <p className="muted">
                핵심 MVP: 링크 기반으로 정보 수집 → 한 번에 복사 → WIMS에 직접 제출
              </p>

              <div className="stack">
                <button className="btn btn-primary" onClick={() => navigate("/transfer/new")}>
                  양도 등록 시작
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/r/demo-token")}
                  title="지금은 더미 토큰으로 화면만 확인"
                >
                  양수자 링크로 접수(데모)
                </button>
              </div>
            </Card>

            <Card title="최근 진행(더미)">
              <ul className="list">
                <li>양도 #1023 — 상대 입력 대기</li>
                <li>양도 #1022 — 제출 체크 진행중</li>
              </ul>
            </Card>
          </>
        )}

        {tab === "프로필" && (
          <Card title="프로필">
            <p className="muted">로그인 후: 상호/대표자/사업자번호/전화/이메일 등</p>
            <button className="btn btn-primary" onClick={() => navigate("/profile")}>
              프로필 보기
            </button>
          </Card>
        )}
      </main>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card">
      <h3 className="card-title">{title}</h3>
      {children}
    </section>
  );
}
