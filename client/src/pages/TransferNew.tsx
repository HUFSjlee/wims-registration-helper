import { useNavigate } from "react-router-dom";

export default function TransferNew() {
  const navigate = useNavigate();

  return (
    <div style={wrap}>
      <h2>양도 등록</h2>
      <p style={muted}>프로토타입: 양도자가 거래를 생성하는 화면(필드 배치만)</p>

      <div style={{ display: "grid", gap: 10 }}>
        <input placeholder="양도 개체(예: 종명/개체수)" style={input} />
        <input placeholder="양도자 사업자번호(또는 식별키)" style={input} />
        <button style={btnPrimary} onClick={() => navigate("/")}>
          등록 완료(데모)
        </button>
      </div>
    </div>
  );
}

const wrap: React.CSSProperties = { maxWidth: 420, margin: "0 auto", padding: 16, fontFamily: "system-ui" };
const input: React.CSSProperties = { padding: 12, borderRadius: 12, border: "1px solid #ddd" };
const btnPrimary: React.CSSProperties = { padding: 12, borderRadius: 12, border: "none", background: "#111", color: "#fff", fontWeight: 700, cursor: "pointer" };
const muted: React.CSSProperties = { color: "#666" };
