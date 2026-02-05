import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="app page">
      <header className="page-head">
        <h2 className="page-title">회원가입</h2>
        <p className="page-subtitle">프로토타입: 필드만 배치해둡니다.</p>
      </header>

      <div className="card">
        <div className="stack">
          <input className="input" placeholder="상호" />
          <input className="input" placeholder="대표자" />
          <input className="input" placeholder="사업자번호" />
          <input className="input" placeholder="전화번호" />
          <input className="input" placeholder="이메일" />
          <input className="input" placeholder="아이디" />
          <input className="input" placeholder="비밀번호" type="password" />

          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            가입 완료(데모)
          </button>

          <Link to="/login" className="muted" style={{ textAlign: "center" }}>
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
