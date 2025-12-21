import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { useTasks } from "../context/TaskContext";

const CreateTaskModal = ({ onClose }) => {
  const { addTask } = useTasks();
  const [formData, setFormData] = useState({
    title: "",
    priority: "보통",
    status: "시작전",
    assignee: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    itemsString: "", // Temporary string for items input
  });

  const handleSubmit = () => {
    if (!formData.title) return;

    // Split items by hyphen
    const items = formData.itemsString
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("-"))
      .map((line) => line.substring(1).trim())
      .filter((line) => line.length > 0);

    addTask({
      ...formData,
      items,
    });
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(255, 255, 255, 0.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 51,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "500px",
          background: "#fff",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ fontSize: "18px" }}>새 업무 생성</h2>
          <button onClick={onClose}>
            <X size={20} color="#64748b" />
          </button>
        </div>

        <div
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Title */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "#64748b",
                marginBottom: "6px",
              }}
            >
              업무명
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="예: 4분기 마케팅 기획"
              autoFocus
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}
          >
            {/* Status */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#64748b",
                  marginBottom: "6px",
                }}
              >
                상태
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "14px",
                  outline: "none",
                  background: "#fff",
                }}
              >
                <option value="시작전">시작전</option>
                <option value="진행중">진행중</option>
                <option value="완료">완료</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            {/* Assignee */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#64748b",
                  marginBottom: "6px",
                }}
              >
                담당자
              </label>
              <input
                type="text"
                value={formData.assignee}
                onChange={(e) =>
                  setFormData({ ...formData, assignee: e.target.value })
                }
                placeholder="담당자 (미지정)"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>
            {/* Date */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#64748b",
                  marginBottom: "6px",
                }}
              >
                마감일
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "#64748b",
                marginBottom: "6px",
              }}
            >
              업무 배경 및 상세 내용
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="업무 배경을 입력하세요..."
              style={{
                width: "100%",
                height: "80px",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                outline: "none",
                resize: "none",
              }}
            />
          </div>

          {/* Items */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "#64748b",
                marginBottom: "6px",
              }}
            >
              할 일 목록 ('-'으로 구분)
            </label>
            <textarea
              value={formData.itemsString}
              onChange={(e) =>
                setFormData({ ...formData, itemsString: e.target.value })
              }
              placeholder="- 세부 업무 1&#10;- 세부 업무 2"
              style={{
                width: "100%",
                height: "80px",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                outline: "none",
                resize: "none",
              }}
            />
          </div>
        </div>

        <div
          style={{
            padding: "16px 24px",
            background: "#f8f9fa",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleSubmit}
            style={{
              background: "#000",
              color: "#fff",
              padding: "10px 24px",
              borderRadius: "var(--radius-full)",
              fontWeight: 600,
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Save size={16} /> 생성하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
