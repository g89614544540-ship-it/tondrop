import React, { useState } from 'react';

interface Props {
  balance: number;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
}

const Wallet: React.FC<Props> = ({ balance, onDeposit, onWithdraw }) => {
  const [tab, setTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');

  const handleAction = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    if (tab === 'deposit') {
      onDeposit(val);
    } else {
      if (val > balance) {
        alert('Недостаточно средств');
        return;
      }
      onWithdraw(val);
    }
    setAmount('');
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>💰</div>
        <h2 style={{ color: '#fff', fontSize: '22px', margin: '0 0 8px 0' }}>Кошелёк</h2>
        <div style={{ color: '#00d4ff', fontSize: '36px', fontWeight: 700 }}>{balance} TON</div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button onClick={() => setTab('deposit')} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: tab === 'deposit' ? 'linear-gradient(135deg, #00d4ff, #7b2ff2)' : '#1a2332', color: tab === 'deposit' ? '#fff' : '#8899aa' }}>Пополнить</button>
        <button onClick={() => setTab('withdraw')} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: tab === 'withdraw' ? 'linear-gradient(135deg, #00d4ff, #7b2ff2)' : '#1a2332', color: tab === 'withdraw' ? '#fff' : '#8899aa' }}>Вывести</button>
      </div>
      <div style={{ background: '#1a2332', borderRadius: '14px', padding: '16px', border: '1px solid #2a3a4a' }}>
        <div style={{ color: '#fff', fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>{tab === 'deposit' ? '📥 Пополнение' : '📤 Вывод'}</div>
        <input type="number" placeholder="Сумма (TON)" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%', padding: '12px', background: '#0d1520', border: '1px solid #2a3a4a', borderRadius: '10px', color: '#fff', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          {[1, 5, 10, 25].map(v => (
            <button key={v} onClick={() => setAmount(String(v))} style={{ flex: 1, padding: '8px', background: '#0d1520', border: '1px solid #2a3a4a', borderRadius: '8px', color: '#00d4ff', fontSize: '13px', cursor: 'pointer' }}>{v} TON</button>
          ))}
        </div>
        <button onClick={handleAction} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #00d4ff, #7b2ff2)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>{tab === 'deposit' ? '💎 Пополнить' : '📤 Вывести'}</button>
      </div>
    </div>
  );
};

export default Wallet;