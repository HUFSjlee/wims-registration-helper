export default function Profile() {
    return (
      <div style={wrap}>
        <h2>프로필</h2>
        <p style={muted}>로그인 한 회원 프로필 (프로토타입)</p>
  
        <div style={card}>
          <div>상호: (demo)</div>
          <div>대표자: (demo)</div>
          <div>사업자번호: (demo)</div>
          <div>전화번호: (demo)</div>
          <div>이메일: (demo)</div>
        </div>
      </div>
    );
  }
  
  const wrap: React.CSSProperties = { maxWidth: 420, margin: "0 auto", padding: 16, fontFamily: "system-ui" };
  const muted: React.CSSProperties = { color: "#666" };
  const card: React.CSSProperties = { border: "1px solid #e5e5e5", borderRadius: 14, padding: 14, background: "#fff" };
  