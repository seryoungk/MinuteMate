import React, { useState, useEffect } from "react";
import { Sparkles, Trash2, Loader2 } from "lucide-react";
import { useTasks } from "../context/TaskContext";
import { GoogleGenerativeAI } from "@google/generative-ai";

const PLACEHOLDER_TEXT = `회의 내용을 입력하면 AI가 자동으로 요약하여,
해야 할 업무의 제목과 상세 내용을 추출해줍니다.

추출된 업무 > [추가하기] 버튼을 클릭하면 
대시보드에 업무를 자동으로 추가할 수 있습니다.

업무들 사이 '//' 를 넣으면 업무들을 구분하기 더 쉬워져요.
`;

const MeetingSummary = () => {
  const { addTask } = useTasks();
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || "");

  // Initialize from localStorage or empty
  const [inputText, setInputText] = useState(() => {
    const saved = localStorage.getItem("meeting_input_text");
    // Check if it matches the legacy default text (starts with specific date)
    if (saved && saved.startsWith("일시: 2023년 10월 26일")) {
      return "";
    }
    return saved !== null ? saved : "";
  });

  const [summaryResult, setSummaryResult] = useState({
    summary: "",
    tasks: [],
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("meeting_input_text", inputText);
  }, [inputText]);

  const handleReset = () => {
    if (
      window.confirm(
        "작성 중인 회의 노트가 모두 삭제되고 초기화됩니다. 정말 초기화하시겠습니까?"
      )
    ) {
      setInputText("");
      setAnalyzed(false);
      setSummaryResult({ summary: "", tasks: [] });
      localStorage.removeItem("meeting_input_text");
    }
  };

  const handleAnalyze = async () => {
    if (!apiKey) {
      alert("Google API Key를 찾을 수 없습니다. .env 파일을 확인해주세요.");
      return;
    }

    if (!inputText.trim()) {
      alert("회의 내용을 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        You are a helpful project manager assistant.
        Analyze the following meeting notes and provide a summary and a list of actionable tasks.
        
        CRITICAL RULES for Task Extraction:
        1. **Group by Project/Topic**: Do NOT create separate tasks for every small action. Instead, group related actions under one high-level Task Title (e.g., "Asset Portal Development").
        2. **Use Checklist for Details**: Put the specific actions into the 'items' list.
        3. **Assignees in Checklist**: If a task involves multiple people, set the main Assignee to the primary owner (or 'Team'), and specify who does what in the checklist items (e.g., "- Name: Action detail").
        4. **No Duplicates**: Ensure the same project doesn't appear as multiple cards. Combine them.
        5. **Priority**: Infer the priority based on urgency and importance ('높음', '보통', '낮음'). Default to '보통'.
        6. **Explicit Separator**: If the input contains "//", treat it as a HARD SEPARATOR between different projects. Content before and after "//" MUST be in separate task cards.
        
        Input Text:
        ${inputText}

        Response Format (JSON only):
        {
          "summary": "Full summary in Korean...",
          "tasks": [
            {
              "title": "High-level Project/Topic Title (Korean)",
              "assignee": "Primary Owner Name",
              "priority": "높음 | 보통 | 낮음",
              "description": "Brief context of the project",
              "items": [
                "Specific action 1 (e.g. Someone: do something)",
                "Specific action 2"
              ]
            }
          ]
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean up markdown code blocks if present
      const jsonStr = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const data = JSON.parse(jsonStr);

      const formattedTasks = data.tasks.map((t) => ({
        ...t,
        priority: t.priority || "보통", // Use extracted priority or default
        status: "시작전",
        date: new Date().toISOString().split("T")[0], // Today
        added: false,
      }));

      setSummaryResult({
        summary: data.summary,
        tasks: formattedTasks,
      });

      setAnalyzed(true);
    } catch (error) {
      console.error("AI Error:", error);
      alert(
        "AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n" +
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = (index) => {
    const taskToAdd = summaryResult.tasks[index];
    addTask({
      title: taskToAdd.title,
      assignee: taskToAdd.assignee,
      status: "시작전",
      date: new Date().toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
      }),
      description: taskToAdd.description,
      priority: taskToAdd.priority,
      items: taskToAdd.items,
    });

    // Mark as added locally
    const newTasks = [...summaryResult.tasks];
    newTasks[index].added = true;
    setSummaryResult((prev) => ({ ...prev, tasks: newTasks }));
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Left Panel: Input */}
      <div
        className="glass"
        style={{
          flex: 1,
          padding: "24px",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2 style={{ fontSize: "18px" }}>회의 노트 입력</h2>

          <button
            onClick={handleReset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "6px",
              color: "#ef4444",
              fontSize: "13px",
              fontWeight: 600,
              background: "#fef2f2",
              border: "1px solid #fee2e2",
            }}
          >
            <Trash2 size={14} /> 초기화
          </button>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={PLACEHOLDER_TEXT}
          style={{
            flex: 1,
            width: "100%",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: "var(--radius-md)",
            padding: "16px",
            fontSize: "15px",
            lineHeight: "1.6",
            resize: "none",
            fontFamily: "inherit",
            outline: "none",
            background: "#f8f9fa",
          }}
        />
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              background: "#000",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "var(--radius-full)",
              fontWeight: 600,
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              opacity: loading ? 0.8 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spin" />
                <span>AI 분석 중...</span>
              </>
            ) : (
              <>
                <span>AI 분석 시작</span>
                <Sparkles size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Panel: Result */}
      <div
        className="glass"
        style={{
          flex: 1,
          borderRadius: "var(--radius-lg)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
          background: "#fff",
          opacity: analyzed ? 1 : 0.5,
          transition: "opacity 0.5s",
          pointerEvents: analyzed ? "auto" : "none",
        }}
      >
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ fontSize: "18px" }}>분석 결과</h2>
        </div>

        {analyzed && (
          <div
            style={{
              padding: "24px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "32px",
            }}
          >
            {/* Summary Section */}
            <div>
              <h3
                style={{
                  fontSize: "15px",
                  marginBottom: "12px",
                  fontWeight: 600,
                }}
              >
                요약
              </h3>
              <div
                style={{
                  background: "var(--tint-mint-subtle)",
                  padding: "20px",
                  borderRadius: "var(--radius-md)",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "#334155",
                  border: "1px solid rgba(0,0,0,0.02)",
                }}
              >
                {summaryResult.summary}
              </div>
            </div>

            {/* Extracted Tasks Section */}
            <div>
              <h3
                style={{
                  fontSize: "15px",
                  marginBottom: "12px",
                  fontWeight: 600,
                }}
              >
                추출된 업무
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {summaryResult.tasks.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "16px",
                      background: "#fff",
                      border: "1px solid rgba(0,0,0,0.06)",
                      borderRadius: "var(--radius-md)",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.01)",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            marginBottom: "4px",
                          }}
                        >
                          {item.title}
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>
                          담당자: {item.assignee}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddTask(idx)}
                        disabled={item.added}
                        style={{
                          background: item.added ? "#cbd5e1" : "#000",
                          color: "#fff",
                          padding: "6px 14px",
                          borderRadius: "var(--radius-full)",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: item.added ? "default" : "pointer",
                          minWidth: "70px",
                        }}
                      >
                        {item.added ? "추가됨" : "추가"}
                      </button>
                    </div>
                    {/* Description Preview */}
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#475569",
                        background: "#f8f9fa",
                        padding: "12px",
                        borderRadius: "8px",
                      }}
                    >
                      <div style={{ marginBottom: "8px", lineHeight: "1.5" }}>
                        {item.description}
                      </div>
                      {item.items && item.items.length > 0 && (
                        <div
                          style={{
                            borderTop: "1px solid rgba(0,0,0,0.05)",
                            paddingTop: "8px",
                            marginTop: "8px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              color: "#94a3b8",
                              marginBottom: "6px",
                            }}
                          >
                            세부 할 일
                          </div>
                          <ul style={{ listStyle: "none", padding: 0 }}>
                            {item.items.map((sub, i) => (
                              <li
                                key={i}
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: "6px",
                                  marginBottom: "4px",
                                  fontSize: "12px",
                                  color: "#334155",
                                }}
                              >
                                <span
                                  style={{ color: "#cbd5e1", marginTop: "1px" }}
                                >
                                  •
                                </span>
                                <span>{sub}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingSummary;
