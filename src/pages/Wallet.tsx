import React, { useState } from 'react';

interface Props {
  balance: number;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
}

const Wallet: React.FC<Props> = ({ balance, onDeposit, onWithdraw }) => {
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit');

  const handleAction = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    if (mode === 'deposit') onDeposit(val);
    else onWithdraw(val);
    setAmount('');
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#fff', fontSize: '20px', margin: '0 0 4px 0' }}>💰 Кошелёк</h2>
      </div>
      <div style={{ background: 'linear-gradient(135deg, #00d4ff22, #7b2ff222)', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid #00d4ff33' }}>
        <div style={{ color: '#8899aa', fontSize: '13px', marginBottom: '4px' }}>Баланс</div>
        <div style={{ color: '#00d4ff', fontSize: '32px', fontWeight: 700 }}>{balance} TON</div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={() => setMode('deposit')} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: mode === 'deposit' ? '#00d4ff' : '#1a2332', color: mode === 'deposit' ? '#000' : '#8899aa' }}>Пополнить</button>
        <button onClick={() => setMode('withdraw')} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: mode === 'withdraw' ? '#00d4ff' : '#1a2332', color: mode === 'withdraw' ? '#000' : '#8899aa' }}>Вывести</button>
      </div>
      <div style={{ background: '#1a2332', borderRadius: '14px', padding: '16px', border: '1px solid #2a3a4a' }}>
        <input type="number" placeholder="Сумма (TON)" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%', padding: '12px', background: '#0d1520', border: '1px solid #2a3a4a', borderRadius: '10px', color: '#fff', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          {[1, 5, 10, 50].map(v => (
            <button key={v} onClick={() => setAmount(String(v))} style={{ flex: 1, padding: '8px', background: '#0d1520', border: '1px solid #2a3a4a', borderRadius: '8px', color: '#00d4ff', fontSize: '13px', cursor: 'pointer' }}>{v}</button>
          ))}
        </div>
        <button onClick={handleAction} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #00d4ff, #7b2ff2)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
          {mode === 'deposit' ? '💳 Пополнить через Crypto Bot' : '📤 Вывести TON'}
        </button>
      </div>
    </div>
  );
};

export default Wallet;