import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type TabKey = "등록" | "폐사" | "양도/양수" | "프로필";

export default function Home() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("양도/양수");

  const tabs: TabKey[] = useMemo(() => ["등록", "폐사", "양도/양수", "프로필"], []);

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>WIMS Helper</h2>
        <button onClick={() => navigate("/login")} style={btnGhost}>
          로그인
        </button>
      </header>

      {/* 상단 탭 */}
      <div style={{ display: "flex", gap: 8, marginTop: 16, overflowX: "auto" }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              ...tabBtn,
              background: tab === t ? "#111" : "#f2f2f2",
              color: tab === t ? "#fff" : "#111",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <main style={{ marginTop: 16 }}>
        {tab === "등록" && (
          <Card title="등록(보유/증식)">
            <p style={muted}>프로토타입 단계: 등록 화면은 다음 단계에서 붙입니다.</p>
            <button style={btnPrimary} disabled>
              등록하러 가기
            </button>
          </Card>
        )}

        {tab === "폐사" && (
          <Card title="폐사 신고">
            <p style={muted}>선택된 개체 폐사신고 플로우는 다음 단계에서 붙입니다.</p>
            <button style={btnPrimary} disabled>
              폐사 신고하기
            </button>
          </Card>
        )}

        {tab === "양도/양수" && (
          <>
            <Card title="양도/양수 (조회/접수)">
              <p style={muted}>
                핵심 MVP: 링크 기반으로 정보 수집 → 한 번에 복사 → WIMS에 직접 제출
              </p>

              <div style={{ display: "grid", gap: 10 }}>
                <button style={btnPrimary} onClick={() => navigate("/transfer/new")}>
                  양도 등록 시작
                </button>

                <button
                  style={btnSecondary}
                  onClick={() => navigate("/r/demo-token")}
                  title="지금은 더미 토큰으로 화면만 확인"
                >
                  양수자 링크로 접수(데모)
                </button>
              </div>
            </Card>

            <Card title="최근 진행(더미)">
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>양도 #1023 — 상대 입력 대기</li>
                <li>양도 #1022 — 제출 체크 진행중</li>
              </ul>
            </Card>
          </>
        )}

        {tab === "프로필" && (
          <Card title="프로필">
            <p style={muted}>로그인 후: 상호/대표자/사업자번호/전화/이메일 등</p>
            <button style={btnPrimary} onClick={() => navigate("/profile")}>
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
    <section
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        background: "#fff",
        boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
      }}
    >
      <h3 style={{ margin: "0 0 8px 0" }}>{title}</h3>
      {children}
    </section>
  );
}

const tabBtn: React.CSSProperties = {
  border: "1px solid #e5e5e5",
  borderRadius: 999,
  padding: "10px 12px",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const btnPrimary: React.CSSProperties = {
  border: "none",
  borderRadius: 12,
  padding: "12px 12px",
  cursor: "pointer",
  background: "#111",
  color: "#fff",
  fontWeight: 600,
};

const btnSecondary: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: "12px 12px",
  cursor: "pointer",
  background: "#fafafa",
  fontWeight: 600,
};

const btnGhost: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: 12,
  padding: "8px 10px",
  cursor: "pointer",
  background: "#fff",
};

const muted: React.CSSProperties = { color: "#666", marginTop: 0 };
