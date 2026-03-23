import React, { useState } from 'react';

interface Props {
  auction: any;
  balance: number;
  onBid: (auctionId: number, amount: number) => void;
  onBack: () => void;
}

const AuctionDetail: React.FC<Props> = ({ auction, balance, onBid }) => {
  const [bidAmount, setBidAmount] = useState('');

  const handleBid = () => {
    const amount = parseFloat(bidAmount);
    if (!amount || amount <= 0) return;
    if (amount > balance) {
      alert('Недостаточно средств! Пополните баланс в разделе Кошелёк.');
      return;
    }
    onBid(auction.id, amount);
    setBidAmount('');
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #00d4ff22, #7b2ff222)', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '1px solid #00d4ff33' }}>
        <h2 style={{ color: '#fff', fontSize: '20px', margin: '0 0 12px 0' }}>{auction.title}</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ color: '#8899aa', fontSize: '13px' }}>Текущая ставка</span>
          <span style={{ color: '#00d4ff', fontWeight: 700 }}>{auction.currentBid || 0} TON</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ color: '#8899aa', fontSize: '13px' }}>Участников</span>
          <span style={{ color: '#fff' }}>{auction.currentParticipants || 0}/{auction.maxParticipants || 0}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#8899aa', fontSize: '13px' }}>Всего ставок</span>
          <span style={{ color: '#fff' }}>{auction.totalBids || 0}</span>
        </div>
      </div>

      <div style={{ background: '#1a2332', borderRadius: '14px', padding: '16px', marginBottom: '16px', border: '1px solid #2a3a4a' }}>
        <div style={{ color: '#8899aa', fontSize: '12px', marginBottom: '4px' }}>Ваш баланс</div>
        <div style={{ color: '#00d4ff', fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>{balance} TON</div>
        <input type="number" placeholder="Сумма ставки (TON)" value={bidAmount} onChange={e => setBidAmount(e.target.value)} style={{ width: '100%', padding: '12px', background: '#0d1520', border: '1px solid #2a3a4a', borderRadius: '10px', color: '#fff', fontSize: '14px', marginBottom: '10px', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          {[0.5, 1, 2, 5].map(v => (
            <button key={v} onClick={() => setBidAmount(String(v))} style={{ flex: 1, padding: '8px', background: '#0d1520', border: '1px solid #2a3a4a', borderRadius: '8px', color: '#00d4ff', fontSize: '13px', cursor: 'pointer' }}>{v} TON</button>
          ))}
        </div>
        <button onClick={handleBid} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #00d4ff, #7b2ff2)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>Сделать ставку</button>
      </div>
    </div>
  );
};

export default AuctionDetail;