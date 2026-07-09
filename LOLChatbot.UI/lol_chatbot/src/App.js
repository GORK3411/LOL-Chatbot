import { Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import VerifySuccessPage from "./pages/VerifySuccessPage";
import VerifyFailurePage from "./pages/VerifyFailurePage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUpPage />}></Route>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/chat" element={<ChatPage />}></Route>
      <Route path="/verify-email" element={<VerifyEmailPage />}></Route>
      <Route path="/verify-success" element={<VerifySuccessPage />}></Route>
      <Route path="/verify-failure" element={<VerifyFailurePage />}></Route>
    </Routes>
  );
}

export default App;
