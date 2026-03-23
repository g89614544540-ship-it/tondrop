import React, { useState } from 'react';

interface Props {
  balance: number;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
}

const Wallet: React.FC<Props> = ({ balance }) => {
  const [amount, setAmount] = useState('1');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) { alert('Введите сумму'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: '123', amount: num })
      });
      const data = await res.json();
      if (data.payUrl) {
        window.open(data.payUrl, '_blank');
      } else if (data.pay_url) {
        window.open(data.pay_url, '_blank');
      } else {
        alert('Ошибка: ' + JSON.stringify(data));
      }
    } catch (err: any) {
      alert('Ошибка соединения: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 style={{ color: '#fff', fontSize: '20px', margin: '0 0 16px 0' }}>💰 Кошелёк</h2>
      <div style={{ background: 'linear-gradient(135deg, #00d4ff22, #7b2ff222)', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid #00d4ff33' }}>
        <div style={{ color: '#8899aa', fontSize: '13px', marginBottom: '4px' }}>Баланс</div>
        <div style={{ color: '#00d4ff', fontSize: '32px', fontWeight: 700 }}>{balance} TON</div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {[0.5, 1, 2, 5].map(v => (
          <button key={v} onClick={() => setAmount(String(v))} style={{ flex: 1, padding: '10px', background: amount === String(v) ? '#00d4ff33' : '#1a2332', border: amount === String(v) ? '2px solid #00d4ff' : '1px solid #2a3a4a', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>{v}</button>
        ))}
      </div>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '100%', padding: '14px', marginBottom: '12px', background: '#1a2332', border: '1px solid #2a3a4a', borderRadius: '12px', color: '#fff', fontSize: '15px', boxSizing: 'border-box', textAlign: 'center' }} />
      <button onClick={handleDeposit} disabled={loading} style={{ width: '100%', padding: '14px', marginBottom: '12px', background: 'linear-gradient(135deg, #00d4ff, #7b2ff2)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
        {loading ? '⏳ Создаём счёт...' : '📥 Пополнить через Crypto Bot'}
      </button>
      <button onClick={() => alert('Заявка на вывод создана')} style={{ width: '100%', padding: '14px', background: '#1a2332', border: '1px solid #2a3a4a', borderRadius: '12px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
        📤 Вывести
      </button>
    </div>
  );
};

export default Wallet;