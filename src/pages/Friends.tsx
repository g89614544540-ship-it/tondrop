import React from 'react';

interface Props {
  count: number;
  earnings: number;
  onWithdraw: () => void;
}

const Friends: React.FC<Props> = ({ count, earnings, onWithdraw }) => {
  const refLink = 'https://t.me/TonDropBot?start=ref_' + Math.random().toString(36).slice(2, 8);

  const copyLink = () => {
    navigator.clipboard.writeText(refLink);
    alert('Ссылка скопирована!');
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#fff', fontSize: '20px', margin: '0 0 4px 0' }}>👥 Друзья</h2>
        <p style={{ color: '#8899aa', fontSize: '13px', margin: 0 }}>Приглашайте друзей и зарабатывайте 10% от их ставок</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: '#1a2332', borderRadius: '14px', padding: '16px', textAlign: 'center', border: '1px solid #2a3a4a' }}>
          <div style={{ color: '#fff', fontSize: '24px', fontWeight: 700 }}>{count}</div>
          <div style={{ color: '#8899aa', fontSize: '12px' }}>Приглашено</div>
        </div>
        <div style={{ background: '#1a2332', borderRadius: '14px', padding: '16px', textAlign: 'center', border: '1px solid #2a3a4a' }}>
          <div style={{ color: '#00d4ff', fontSize: '24px', fontWeight: 700 }}>{earnings} TON</div>
          <div style={{ color: '#8899aa', fontSize: '12px' }}>Заработано</div>
        </div>
      </div>
      <div style={{ background: '#1a2332', borderRadius: '14px', padding: '16px', marginBottom: '16px', border: '1px solid #2a3a4a' }}>
        <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Ваша реферальная ссылка</div>
        <div style={{ background: '#0d1520', borderRadius: '8px', padding: '10px', color: '#8899aa', fontSize: '12px', wordBreak: 'break-all', marginBottom: '10px' }}>{refLink}</div>
        <button onClick={copyLink} style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, #00d4ff, #7b2ff2)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>📋 Копировать ссылку</button>
      </div>
      {earnings > 0 && (
        <button onClick={onWithdraw} style={{ width: '100%', padding: '12px', background: '#00ff8822', border: '1px solid #00ff8844', borderRadius: '12px', color: '#00ff88', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Вывести {earnings} TON</button>
      )}
    </div>
  );
};

export default Friends;