import { useParams } from "react-router-dom";

export default function ReceiverLink() {
  const { token } = useParams();

  return (
    <div className="app page">
      <header className="page-head">
        <h2 className="page-title">양수자 접수</h2>
        <p className="page-subtitle">
          링크 토큰(데모): <span className="pill">{token ?? "-"}</span>
        </p>
      </header>

      <div className="card">
        <div className="stack">
          <input className="input" placeholder="양수자 정보(예: 상호/사업자번호)" />
          <input className="input" placeholder="양수 개체 정보(예: 종명/개체수)" />

          <button className="btn btn-primary" onClick={() => alert("다음 단계: 최종 컨펌 화면으로")}>
            다음(데모)
          </button>
        </div>
      </div>
    </div>
  );
}
