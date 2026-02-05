import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import TransferNew from "./pages/TransferNew";
import ReceiverLink from "./pages/ReceiverLink";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 앱 메인 */}
      <Route path="/" element={<Home />} />

      {/* 프로필 */}
      <Route path="/profile" element={<Profile />} />

      {/* 양도 등록 */}
      <Route path="/transfer/new" element={<TransferNew />} />

      {/* 양수자 링크 진입 (token은 나중에 백엔드 붙일 때 사용) */}
      <Route path="/r/:token" element={<ReceiverLink />} />

      {/* 없는 경로는 홈으로 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
