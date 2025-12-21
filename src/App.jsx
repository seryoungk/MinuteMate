import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./views/Dashboard";
import MeetingSummary from "./views/MeetingSummary";
import { TaskProvider } from "./context/TaskContext";
import "./index.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <TaskProvider>
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <Header
            title={
              activeTab === "dashboard" ? "내부 업무 현황" : "회의 AI 요약"
            }
          />

          <main
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "32px",
              backgroundColor: "var(--bg-app)",
            }}
          >
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "meeting" && <MeetingSummary />}
            {activeTab === "team" && (
              <div>
                <h1 style={{ marginBottom: "32px" }}>팀 관리 화면입니다.</h1>
                <div>팀 초대 기능은 아직 구현되지 않은 상태입니다.</div>
                <div>
                  추후, 업무 이메일을 통한 초대 방식을 통해 네오다임 직원만 접근
                  가능하도록 할 예정입니다.
                </div>
              </div>
            )}
            {activeTab === "settings" && (
              <div className="placeholder">
                <div>
                  <h1 style={{ marginBottom: "32px" }}>설정 화면입니다.</h1>
                  <div>아직 구현되지 않은 상태입니다.</div>
                  <div>
                    추후, 설정에 다크 모드, 알림 설정 등 다양한 기능을
                    추가해넣을 예정입니다.
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </TaskProvider>
  );
}

export default App;
