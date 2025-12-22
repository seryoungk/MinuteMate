import React from 'react';
import { Clock, CheckCircle2, Circle } from 'lucide-react';

const TaskCard = ({ task, onClick }) => {
  const getStatusStyle = (status) => {
    if (status === '완료') return { color: '#059669', icon: CheckCircle2, label: '완료', bg: 'var(--badge-green-bg)', text: 'var(--badge-green-text)' };
    if (status === '진행중') return { color: '#2563eb', icon: Clock, label: '진행중', bg: 'var(--badge-yellow-bg)', text: 'var(--badge-yellow-text)' };
    return { color: '#64748b', icon: Circle, label: '시작전', bg: '#f1f5f9', text: '#64748b' };
  };

  const sStyle = getStatusStyle(task.status);
  const StatusIcon = sStyle.icon;

  return (
    <div 
      className="card-hover"
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        boxShadow: 'var(--shadow-soft)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ 
          background: sStyle.bg, 
          color: sStyle.text, 
          padding: '4px 10px', 
          borderRadius: '6px', 
          fontSize: '11px', 
          fontWeight: 700 
        }}>
          {task.status}
        </span>
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: 600, lineHeight: '1.4' }}>{task.title}</h3>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee}`} 
            alt={task.assignee} 
            style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#eee' }}
          />
          <span style={{ fontSize: '12px', color: '#64748b' }}>{task.date}</span>
        </div>
      </div>

      {/* Progress Bar - Always show if items exist or progress > 0 */}
      {(task.progress >= 0 || (task.items && task.items.length > 0)) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
          <div style={{ flex: 1, height: '4px', background: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${task.progress}%`, height: '100%', background: '#2563eb', borderRadius: '2px', transition: 'width 0.3s' }}></div>
          </div>
          <span style={{ fontSize: '11px', color: '#64748b', width: '24px', textAlign: 'right' }}>{task.progress}%</span>
          
          {/* Priority Display */}
          {task.priority && (
             <span style={{ 
               fontSize: '10px', 
               fontWeight: 600,
               padding: '2px 6px',
               borderRadius: '4px',
               backgroundColor: task.priority === '높음' ? '#fee2e2' : task.priority === '낮음' ? '#dcfce7' : '#f1f5f9',
               color: task.priority === '높음' ? '#ef4444' : task.priority === '낮음' ? '#166534' : '#64748b',
               marginLeft: '4px'
             }}>
               {task.priority}
             </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
