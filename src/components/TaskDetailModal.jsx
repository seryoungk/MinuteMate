import React, { useState, useEffect } from 'react';
import { X, Send, Calendar, User, Trash2 } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const TaskDetailModal = ({ task, onClose }) => {
  const { updateTask, deleteTask, toggleTaskItem, fetchComments, addComment } = useTasks();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  
  // Fetch comments when task opens
  useEffect(() => {
    if (task) {
      loadComments();
    }
  }, [task]);

  const loadComments = async () => {
    if (!task) return;
    const data = await fetchComments(task.id);
    setComments(data);
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    try {
      await addComment(task.id, commentText);
      setCommentText('');
      loadComments(); // Refresh comments
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleItem = (idx) => {
    toggleTaskItem(task.id, idx, task.items);
  };

  if (!task) return null;

  // Handlers
  const handleStatusChange = (newStatus) => {
    updateTask(task.id, { status: newStatus });
  };

  const handleDelete = () => {
    if (window.confirm('정말 이 업무를 삭제하시겠습니까?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(255, 255, 255, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    }} onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '600px',
          background: '#fff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px' }}>{task.title}</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={handleDelete}
                style={{ padding: '4px', color: '#ef4444' }}
                title="삭제"
              >
                <Trash2 size={20} />
              </button>
              <button onClick={onClose} style={{ padding: '4px' }}><X size={20} color="#64748b" /></button>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
             {/* Status Select */}
             <select 
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              style={{ 
                background: task.status === '완료' ? 'var(--badge-green-bg)' : '#f1f5f9',
                color: task.status === '완료' ? 'var(--badge-green-text)' : '#64748b', 
                padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' 
              }}>
              <option value="시작전">시작전</option>
              <option value="진행중">진행중</option>
              <option value="완료">완료</option>
            </select>

            {/* Priority Select */}
            <select
              value={task.priority || '보통'}
              onChange={(e) => updateTask(task.id, { priority: e.target.value })}
              style={{
                background: task.priority === '높음' ? '#fee2e2' : task.priority === '낮음' ? '#dcfce7' : '#f1f5f9',
                color: task.priority === '높음' ? '#ef4444' : task.priority === '낮음' ? '#166534' : '#64748b',
                padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer'
              }}
            >
              <option value="높음">높음</option>
              <option value="보통">보통</option>
              <option value="낮음">낮음</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b', marginLeft: 'auto' }}>
              <User size={14} /> {task.assignee}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b' }}>
              <Calendar size={14} /> {task.date}
            </div>
          </div>
        </div>

        <div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto' }}>
          {/* Section: Context (Green Tint) */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#334155' }}>배경 및 상세</h4>
            <div style={{ 
              background: 'var(--tint-green-light)', 
              padding: '16px', 
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#1e293b',
              border: '1px solid rgba(0,0,0,0.02)'
            }}>
              {task.description || '상세 설명이 없습니다.'}
            </div>
          </div>

          {/* Section: To-do with Progress */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '14px', color: '#334155' }}>할 일 목록</h4>
              <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>{task.progress}%</span>
            </div>
            
            {/* Progress Bar */}
            <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px', marginBottom: '12px', overflow: 'hidden' }}>
              <div style={{ width: `${task.progress}%`, height: '100%', background: '#2563eb', borderRadius: '3px', transition: 'width 0.3s ease' }}></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {task.items && task.items.length > 0 ? (
                task.items.map((item, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={item.checked}
                      onChange={() => handleToggleItem(i)}
                      style={{ width: '16px', height: '16px', accentColor: '#2563eb' }} 
                    />
                    <span style={{ 
                      color: item.checked ? '#94a3b8' : '#334155',
                      textDecoration: item.checked ? 'line-through' : 'none'
                    }}>
                      {item.text}
                    </span>
                  </label>
                ))
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>등록된 하위 업무가 없습니다.</div>
              )}
            </div>
          </div>
          
          {/* Comments List */}
          <div style={{ marginBottom: '24px' }}>
             <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#334155' }}>댓글 ({comments.length})</h4>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               {comments.map(c => (
                 <div key={c.id} style={{ fontSize: '13px', background: '#f8f9fa', padding: '10px', borderRadius: '8px' }}>
                   <div style={{ fontWeight: 600, marginBottom: '2px' }}>{c.author}</div>
                   <div>{c.content}</div>
                 </div>
               ))}
              </div>
          </div>
        </div>

        {/* Footer: Comments Input */}
        <div style={{ padding: '16px 24px', background: '#f8f9fa', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
              placeholder="댓글을 입력하세요..." 
              style={{
                width: '100%',
                padding: '10px 40px 10px 16px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button 
              onClick={handleSendComment}
              style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
