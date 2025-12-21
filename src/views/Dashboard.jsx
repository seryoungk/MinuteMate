import React, { useState } from 'react';
import { SlidersHorizontal, Plus } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import TaskDetailModal from '../components/TaskDetailModal';
import CreateTaskModal from '../components/CreateTaskModal';
import { useTasks } from '../context/TaskContext';

const Dashboard = () => {
  const { tasks } = useTasks();
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState({ type: null, value: null });

  // Derive selected task from live data
  const selectedTask = tasks.find(t => t.id === selectedTaskId) || null;

  // Filter Tasks
  const filteredTasks = tasks.filter(task => {
    if (!activeFilter.type) return true;
    if (activeFilter.type === 'status') return task.status === activeFilter.value;
    if (activeFilter.type === 'assignee') return task.assignee === activeFilter.value;
    return true;
  });

  const toggleFilter = (type, value) => {
    if (activeFilter.type === type && activeFilter.value === value) {
      setActiveFilter({ type: null, value: null });
    } else {
      setActiveFilter({ type, value });
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '80px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setActiveFilter({ type: null, value: null })}
              style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', 
              padding: '8px 16px', 
              background: activeFilter.type === null ? '#f1f5f9' : '#fff', 
              borderRadius: 'var(--radius-full)', 
              boxShadow: 'var(--shadow-soft)', fontSize: '14px', fontWeight: 500, color: '#334155' 
            }}>
              전체
            </button>
            <button 
              onClick={() => toggleFilter('status', '시작전')}
              style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', 
              padding: '8px 16px', 
              background: activeFilter.type === 'status' && activeFilter.value === '시작전' ? '#e2e8f0' : '#fff', 
              borderRadius: 'var(--radius-full)', 
              boxShadow: 'var(--shadow-soft)', fontSize: '14px', fontWeight: 500, color: '#334155' 
            }}>
              시작전
            </button>
            <button 
              onClick={() => toggleFilter('status', '진행중')}
              style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', 
              padding: '8px 16px', 
              background: activeFilter.type === 'status' && activeFilter.value === '진행중' ? '#bfdbfe' : '#fff', 
              borderRadius: 'var(--radius-full)', 
              boxShadow: 'var(--shadow-soft)', fontSize: '14px', fontWeight: 500, color: '#334155' 
            }}>
              진행중
            </button>
            <button 
              onClick={() => toggleFilter('status', '완료')}
              style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', 
              padding: '8px 16px', 
              background: activeFilter.type === 'status' && activeFilter.value === '완료' ? '#bbf7d0' : '#fff', 
              borderRadius: 'var(--radius-full)', 
              boxShadow: 'var(--shadow-soft)', fontSize: '14px', fontWeight: 500, color: '#334155' 
            }}>
              완료
            </button>
          </div>
          <button style={{ padding: '8px', color: '#64748b' }}><SlidersHorizontal size={20} /></button>
        </div>

        {/* Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '24px' 
        }}>
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} onClick={() => setSelectedTaskId(task.id)} />
          ))}
          {filteredTasks.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
              조건에 맞는 업무가 없습니다.
            </div>
          )}
        </div>
        
        {/* FAB */}
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
            cursor: 'pointer',
            zIndex: 40
          }}>
          <Plus size={24} />
        </button>
      </div>

      <TaskDetailModal task={selectedTask} onClose={() => setSelectedTaskId(null)} />
      {isCreateModalOpen && <CreateTaskModal onClose={() => setIsCreateModalOpen(false)} />}
    </>
  );
};

export default Dashboard;
