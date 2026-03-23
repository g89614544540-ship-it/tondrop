import React from 'react';

interface Props {
  current: string;
  onNavigate: (page: string) => void;
}

const NavBar: React.FC<Props> = ({ current, onNavigate }) => {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Главная' },
    { id: 'auctions', icon: '🔥', label: 'Аукционы' },
    { id: 'friends', icon: '👥', label: 'Друзья' },
    { id: 'wallet', icon: '💰', label: 'Кошелёк' },
  ];

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0d1520', borderTop: '1px solid #1a2332', display: 'flex', justifyContent: 'center', padding: '8px 0 12px 0', zIndex: 999 }}>
      <div style={{ display: 'flex', maxWidth: '420px', width: '100%', justifyContent: 'space-around' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => onNavigate(tab.id)} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '2px', cursor: 'pointer', padding: '4px 12px' }}>
            <span style={{ fontSize: '20px' }}>{tab.icon}</span>
            <span style={{ fontSize: '10px', color: current === tab.id ? '#00d4ff' : '#556677' }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavBar;