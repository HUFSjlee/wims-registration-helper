import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="app page">
      <header className="page-head">
        <h2 className="page-title">로그인</h2>
        <p className="page-subtitle">프로토타입: 실제 인증은 나중에 붙입니다.</p>
      </header>

      <div className="card">
        <div className="stack">
          <input className="input" placeholder="아이디" />
          <input className="input" placeholder="비밀번호" type="password" />

          <button className="btn btn-primary" onClick={() => navigate("/")}>
            로그인(데모)
          </button>

          <Link to="/signup" className="muted" style={{ textAlign: "center" }}>
            회원가입 하러가기
          </Link>
        </div>
      </div>
    </div>
  );
}
