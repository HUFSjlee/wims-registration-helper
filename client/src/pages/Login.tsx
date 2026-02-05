import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div style={wrap}>
      <h2>로그인</h2>
      <p style={muted}>프로토타입: 실제 인증은 나중에 붙입니다.</p>

      <div style={{ display: "grid", gap: 10 }}>
        <input placeholder="아이디" style={input} />
        <input placeholder="비밀번호" type="password" style={input} />

        <button style={btnPrimary} onClick={() => navigate("/")}>
          로그인(데모)
        </button>

        <Link to="/signup" style={{ textAlign: "center" }}>
          회원가입 하러가기
        </Link>
      </div>
    </div>
  );
}

const wrap: React.CSSProperties = { maxWidth: 420, margin: "0 auto", padding: 16, fontFamily: "system-ui" };
const input: React.CSSProperties = { padding: 12, borderRadius: 12, border: "1px solid #ddd" };
const btnPrimary: React.CSSProperties = { padding: 12, borderRadius: 12, border: "none", background: "#111", color: "#fff", fontWeight: 700, cursor: "pointer" };
const muted: React.CSSProperties = { color: "#666" };
