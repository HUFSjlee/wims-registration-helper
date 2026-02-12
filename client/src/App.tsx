import { Navigate, Route, Routes } from "react-router-dom";
import WebLoginPage from "./pages/web/WebLoginPage";
import WebSignupPersonalPage from "./pages/web/WebSignupPersonalPage";
import WebSignupBusinessPage from "./pages/web/WebSignupBusinessPage";
import WebMainPage from "./pages/web/WebMainPage";
import WebTransferPage from "./pages/web/WebTransferPage";
import WebReceivePage from "./pages/web/WebReceivePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/web/main" replace />} />
      <Route path="/web/login" element={<WebLoginPage />} />
      <Route path="/web/signup/personal" element={<WebSignupPersonalPage />} />
      <Route path="/web/signup/business" element={<WebSignupBusinessPage />} />
      <Route path="/web/main" element={<WebMainPage />} />
      <Route path="/web/transfer" element={<WebTransferPage />} />
      <Route path="/web/receive" element={<WebReceivePage />} />
      <Route path="*" element={<Navigate to="/web/main" replace />} />
    </Routes>
  );
}
