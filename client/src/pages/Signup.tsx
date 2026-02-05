import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div style={wrap}>
      <h2>회원가입</h2>
      <p style={muted}>프로토타입: 필드만 배치해둡니다.</p>

      <div style={{ display: "grid", gap: 10 }}>
        <input placeholder="상호" style={input} />
        <input placeholder="대표자" style={input} />
        <input placeholder="사업자번호" style={input} />
        <input placeholder="전화번호" style={input} />
        <input placeholder="이메일" style={input} />
        <input placeholder="아이디" style={input} />
        <input placeholder="비밀번호" type="password" style={input} />

        <button style={btnPrimary} onClick={() => navigate("/login")}>
          가입 완료(데모)
        </button>

        <Link to="/login" style={{ textAlign: "center" }}>
          로그인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

const wrap: React.CSSProperties = { maxWidth: 420, margin: "0 auto", padding: 16, fontFamily: "system-ui" };
const input: React.CSSProperties = { padding: 12, borderRadius: 12, border: "1px solid #ddd" };
const btnPrimary: React.CSSProperties = { padding: 12, borderRadius: 12, border: "none", background: "#111", color: "#fff", fontWeight: 700, cursor: "pointer" };
const muted: React.CSSProperties = { color: "#666" };
