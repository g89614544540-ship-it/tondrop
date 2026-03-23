import React from 'react';

interface Props {
  balance: number;
  friends: number;
  auctions: number;
  isAdmin: boolean;
  onDiamondClick: () => void;
}

const Home: React.FC<Props> = ({ balance, friends, auctions, isAdmin, onDiamondClick }) => {
  return (
    <div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <div onClick={onDiamondClick} style={{ fontSize: '48px', marginBottom: '8px', cursor: 'pointer', userSelect: 'none' }}>💎</div>
        <h1 style={{ fontSize: '28px', color: '#fff', margin: '0 0 4px 0' }}>TonDrop</h1>
        <p style={{ color: '#8899aa', fontSize: '14px', margin: '0 0 30px 0' }}>Аукцион сид-фраз TON</p>
      </div>
      <div style={{ background: 'linear-gradient(135deg, #00d4ff22, #7b2ff222)', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid #00d4ff33' }}>
        <div style={{ color: '#8899aa', fontSize: '13px', marginBottom: '4px' }}>Ваш баланс</div>
        <div style={{ color: '#00d4ff', fontSize: '32px', fontWeight: 700 }}>{balance} TON</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: '#1a2332', borderRadius: '14px', padding: '16px', textAlign: 'center', border: '1px solid #2a3a4a' }}>
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>🔥</div>
          <div style={{ color: '#fff', fontSize: '20px', fontWeight: 700 }}>{auctions}</div>
          <div style={{ color: '#8899aa', fontSize: '12px' }}>Аукционов</div>
        </div>
        <div style={{ background: '#1a2332', borderRadius: '14px', padding: '16px', textAlign: 'center', border: '1px solid #2a3a4a' }}>
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>👥</div>
          <div style={{ color: '#fff', fontSize: '20px', fontWeight: 700 }}>{friends}</div>
          <div style={{ color: '#8899aa', fontSize: '12px' }}>Друзей</div>
        </div>
      </div>
      {isAdmin && (
        <div style={{ background: '#2a1a00', borderRadius: '14px', padding: '14px', border: '1px solid #ff990033', textAlign: 'center' }}>
          <span style={{ color: '#ffaa00', fontSize: '14px' }}>👑 Режим администратора активен</span>
        </div>
      )}
    </div>
  );
};

export default Home;