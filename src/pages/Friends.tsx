import React from 'react';

interface FriendsProps {
  count: number;
  earnings: number;
  onWithdraw: () => void;
  referralCode?: string;
  botUsername?: string;
}

const Friends: React.FC<FriendsProps> = ({ count, earnings, onWithdraw, referralCode, botUsername }) => {
  const referralLink = `https://t.me/${botUsername || 'TonDrop_bot'}?start=${referralCode || ''}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Ссылка скопирована!');
  };

  const shareLink = () => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Заходи в TonDrop! Аукционы с крипто-призами 💎')}`);
    } else {
      copyLink();
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>👥</div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 4px 0' }}>Друзья</h2>
        <p style={{ color: '#8892a0', fontSize: '14px', margin: 0 }}>Приглашай друзей и получай 5% от их ставок</p>
      </div>

      {/* Статистика */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ flex: 1, background: '#1a2332', borderRadius: '14px', padding: '16px', textAlign: 'center', border: '1px solid #2a3a4a' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#00d4ff' }}>{count}</div>
          <div style={{ fontSize: '12px', color: '#8892a0', marginTop: '4px' }}>Друзей</div>
        </div>
        <div style={{ flex: 1, background: '#1a2332', borderRadius: '14px', padding: '16px', textAlign: 'center', border: '1px solid #2a3a4a' }}>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#00ff88' }}>{earnings.toFixed(2)}</div>
          <div style={{ fontSize: '12px', color: '#8892a0', marginTop: '4px' }}>TON заработано</div>
        </div>
      </div>

      {/* Реферальная ссылка */}
      <div style={{ background: '#1a2332', borderRadius: '14px', padding: '16px', marginBottom: '16px', border: '1px solid #2a3a4a' }}>
        <div style={{ fontSize: '13px', color: '#8892a0', marginBottom: '8px' }}>Твоя ссылка:</div>
        <div style={{ 
          background: '#0d1520', 
          borderRadius: '10px', 
          padding: '12px', 
          fontSize: '12px', 
          color: '#00d4ff', 
          wordBreak: 'break-all',
          marginBottom: '12px'
        }}>
          {referralLink}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={copyLink} style={{ 
            flex: 1, padding: '12px', 
            background: '#00d4ff22', border: '1px solid #00d4ff', 
            borderRadius: '10px', color: '#00d4ff', 
            fontSize: '13px', fontWeight: 600, cursor: 'pointer' 
          }}>
            📋 Копировать
          </button>
          <button onClick={shareLink} style={{ 
            flex: 1, padding: '12px', 
            background: 'linear-gradient(135deg, #00d4ff, #7b2ff2)', 
            border: 'none', borderRadius: '10px', 
            color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' 
          }}>
            📤 Поделиться
          </button>
        </div>
      </div>

      {/* Кнопка вывода */}
      {earnings > 0 && (
        <button onClick={onWithdraw} style={{ 
          width: '100%', padding: '14px', 
          background: 'linear-gradient(135deg, #00ff88, #00cc6a)', 
          border: 'none', borderRadius: '12px', 
          color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer' 
        }}>
          Вывести {earnings.toFixed(2)} TON на баланс
        </button>
      )}

      {/* Как это работает */}
      <div style={{ background: '#1a2332', borderRadius: '14px', padding: '16px', marginTop: '16px', border: '1px solid #2a3a4a' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Как это работает?</div>
        <div style={{ fontSize: '13px', color: '#8892a0', lineHeight: 1.6 }}>
          1. Поделись ссылкой с другом<br/>
          2. Друг заходит в TonDrop по ссылке<br/>
          3. Ты получаешь 5% от каждой его ставки<br/>
          4. Выводи заработок на баланс
        </div>
      </div>
    </div>
  );
};

export default Friends;