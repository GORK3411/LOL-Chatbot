import "./App.css";
import "./styles/Form.css";
import "./styles/ChatHistory.css";
import { Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUpPage />}></Route>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/chat" element={<ChatPage />}></Route>
    </Routes>
  );
}

export default App;
