import React from 'react';

interface Props {
  balance: number;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
}

const Wallet: React.FC<Props> = ({ balance }) => {
  const openDeposit = () => {
    window.open('https://t.me/CryptoBot?start=pay', '_blank');
  };

  const openWithdraw = () => {
    window.open('https://t.me/CryptoBot', '_blank');
  };

  return (
    <div>
      <h2 style={{ color: '#fff', fontSize: '20px', margin: '0 0 16px 0' }}>💰 Кошелёк</h2>

      <div style={{ background: 'linear-gradient(135deg, #00d4ff22, #7b2ff222)', borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid #00d4ff33' }}>
        <div style={{ color: '#8899aa', fontSize: '13px', marginBottom: '4px' }}>Баланс</div>
        <div style={{ color: '#00d4ff', fontSize: '32px', fontWeight: 700 }}>{balance} TON</div>
      </div>

      <button onClick={openDeposit} style={{ width: '100%', padding: '14px', marginBottom: '12px', background: 'linear-gradient(135deg, #00d4ff, #7b2ff2)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
        📥 Пополнить через Crypto Bot
      </button>

      <button onClick={openWithdraw} style={{ width: '100%', padding: '14px', background: '#1a2332', border: '1px solid #2a3a4a', borderRadius: '12px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
        📤 Вывести через Crypto Bot
      </button>

      <div style={{ marginTop: '20px', background: '#1a2332', borderRadius: '14px', padding: '16px', border: '1px solid #2a3a4a' }}>
        <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Как это работает?</div>
        <div style={{ color: '#8899aa', fontSize: '13px', lineHeight: '1.6' }}>
          1. Нажмите «Пополнить» — откроется Crypto Bot<br />
          2. Отправьте TON на указанный адрес<br />
          3. Баланс обновится автоматически<br />
          4. Для вывода нажмите «Вывести»
        </div>
      </div>
    </div>
  );
};

export default Wallet;