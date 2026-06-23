import logo from "./logo.svg";
import "./App.css";
import "./styles/Form.css";
import "./styles/ChatHistory.css";
import ChatHistory from "./components/ChatMessage";
import SignUpForm from "./components/SignUpForm";
import LoginForm from "./components/LoginForm";
import { Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
function App() {
  return (
    /*
    <div className="App">
      <SignUpForm />
      <LoginForm />
      <ChatHistory
        messages={[
          { text: "Hello, world!", isUser: true },
          { text: "Hi there!", isUser: false },
          { text: "Hi there!", isUser: true },
          { text: "Hi there!", isUser: false },
        ]}
      />
    </div>
    */
    <Routes>
      <Route path="/" element={<SignUpPage />}></Route>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/chat" element={<ChatPage />}></Route>
    </Routes>
  );
}

export default App;
