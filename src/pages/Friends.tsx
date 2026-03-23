import React from 'react';

interface Props {
  count: number;
  earnings: number;
  onWithdraw: () => void;
}

const Friends: React.FC<Props> = ({ count, earnings, onWithdraw }) => {
  return (
    <div>
      <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>👥</div>
        <h2 style={{ color: '#fff', fontSize: '22px', margin: '0 0 4px 0' }}>Друзья</h2>
        <p style={{ color: '#8899aa', fontSize: '13px', margin: 0 }}>Приглашайте друзей и получайте 10% от их ставок</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: '#1a2332', borderRadius: '14px', padding: '16px', textAlign: 'center', border: '1px solid #2a3a4a' }}>
          <div style={{ color: '#00d4ff', fontSize: '28px', fontWeight: 700 }}>{count}</div>
          <div style={{ color: '#8899aa', fontSize: '12px' }}>Друзей</div>
        </div>
        <div style={{ background: '#1a2332', borderRadius: '14px', padding: '16px', textAlign: 'center', border: '1px solid #2a3a4a' }}>
          <div style={{ color: '#00ff88', fontSize: '28px', fontWeight: 700 }}>{earnings} TON</div>
          <div style={{ color: '#8899aa', fontSize: '12px' }}>Заработано</div>
        </div>
      </div>
      <div style={{ background: '#1a2332', borderRadius: '14px', padding: '16px', marginBottom: '16px', border: '1px solid #2a3a4a' }}>
        <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>📎 Ваша реферальная ссылка</div>
        <div style={{ background: '#0d1520', borderRadius: '10px', padding: '12px', color: '#00d4ff', fontSize: '13px', wordBreak: 'break-all' }}>https://t.me/TonDrop_bot?start=ref_demo</div>
        <button onClick={() => navigator.clipboard.writeText('https://t.me/TonDrop_bot?start=ref_demo')} style={{ width: '100%', padding: '10px', marginTop: '10px', background: 'linear-gradient(135deg, #00d4ff, #7b2ff2)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>📋 Скопировать ссылку</button>
      </div>
      {earnings > 0 && (
        <button onClick={onWithdraw} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #00ff88, #00d4ff)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>Вывести {earnings} TON</button>
      )}
    </div>
  );
};

export default Friends;