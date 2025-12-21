import React from 'react';
import { LayoutDashboard, FileText, Users, Settings } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { id: 'meeting', label: '회의 요약', icon: FileText },
    { id: 'team', label: '팀 관리', icon: Users },
    { id: 'settings', label: '설정', icon: Settings },
  ];

  return (
    <div className="glass" style={{
      width: 'var(--sidebar-width)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      zIndex: 10
    }}>
      <div style={{ padding: '0 12px 40px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '24px', height: '24px', background: '#1a1a1a', borderRadius: '6px' }}></div>
        <span style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em' }}>MinuteMate</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? '#f1f5f9' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ 
          padding: '16px', 
          background: 'rgba(0,0,0,0.03)', 
          borderRadius: 'var(--radius-md)',
          fontSize: '13px',
          color: 'var(--text-secondary)'
        }}>
          <strong>Premium Plan</strong>
          <div style={{ marginTop: '4px' }}>내부 전용 (Alpha)</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
