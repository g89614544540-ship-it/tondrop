import React from 'react';

interface Props {
  active: string;
  onNavigate: (page: string) => void;
  isAdmin: boolean;
}

const NavBar: React.FC<Props> = ({ active, onNavigate, isAdmin }) => {
  const items = [
    { id: 'home', icon: '🏠', label: 'Главная' },
    { id: 'auctions', icon: '🔥', label: 'Аукционы' },
    { id: 'friends', icon: '👥', label: 'Друзья' },
    { id: 'wallet', icon: '💎', label: 'Кошелёк' },
  ];

  if (isAdmin) {
    items.push({ id: 'admin', icon: '👑', label: 'Админ' });
  }

  return (
    <nav className="nav">
      {items.map(item => (
        <button
          key={item.id}
          className={`nav__item ${active === item.id ? 'nav__item--active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <span className="nav__icon">{item.icon}</span>
          <span className="nav__label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default NavBar;