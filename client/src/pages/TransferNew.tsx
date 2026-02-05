import { useNavigate } from "react-router-dom";

export default function TransferNew() {
  const navigate = useNavigate();

  return (
    <div className="app page">
      <header className="page-head">
        <h2 className="page-title">양도 등록</h2>
        <p className="page-subtitle">프로토타입: 양도자가 거래를 생성하는 화면(필드 배치만)</p>
      </header>

      <div className="card">
        <div className="stack">
          <input className="input" placeholder="양도 개체(예: 종명/개체수)" />
          <input className="input" placeholder="양도자 사업자번호(또는 식별키)" />
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            등록 완료(데모)
          </button>
        </div>
      </div>
    </div>
  );
}
