import { useParams } from "react-router-dom";

export default function ReceiverLink() {
  const { token } = useParams();

  return (
    <div style={wrap}>
      <h2>양수자 접수</h2>
      <p style={muted}>링크 토큰(데모): {token}</p>

      <div style={{ display: "grid", gap: 10 }}>
        <input placeholder="양수자 정보(예: 상호/사업자번호)" style={input} />
        <input placeholder="양수 개체 정보(예: 종명/개체수)" style={input} />

        <button style={btnPrimary} onClick={() => alert("다음 단계: 최종 컨펌 화면으로")}>
          다음(데모)
        </button>
      </div>
    </div>
  );
}

const wrap: React.CSSProperties = { maxWidth: 420, margin: "0 auto", padding: 16, fontFamily: "system-ui" };
const input: React.CSSProperties = { padding: 12, borderRadius: 12, border: "1px solid #ddd" };
const btnPrimary: React.CSSProperties = { padding: 12, borderRadius: 12, border: "none", background: "#111", color: "#fff", fontWeight: 700, cursor: "pointer" };
const muted: React.CSSProperties = { color: "#666" };
