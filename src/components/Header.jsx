import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

const Header = ({ title }) => {
  return (
    <header className="glass" style={{
      height: 'var(--header-height)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      borderBottom: '1px solid rgba(0,0,0,0.05)',
      zIndex: 9
    }}>
      <h1 style={{ fontSize: '20px', fontWeight: 700 }}>{title}</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: '#f1f5f9',
          borderRadius: 'var(--radius-full)',
          padding: '8px 16px',
          width: '300px'
        }}>
          <Search size={16} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="검색..." 
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              marginLeft: '8px',
              fontSize: '14px',
              width: '100%'
            }}
          />
        </div>

        <button style={{ position: 'relative' }}>
          <Bell size={20} color="var(--text-secondary)" />
          <div style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '8px',
            height: '8px',
            background: '#ef4444',
            borderRadius: '50%'
          }}></div>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#e2e8f0',
            overflow: 'hidden'
          }}>
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="User" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <ChevronDown size={16} color="var(--text-secondary)" />
        </div>
      </div>
    </header>
  );
};

export default Header;
