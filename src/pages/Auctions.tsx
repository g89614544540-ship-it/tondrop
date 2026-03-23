import React from 'react';

interface Props {
  auctions: any[];
  onSelect: (id: number) => void;
}

const Auctions: React.FC<Props> = ({ auctions, onSelect }) => {
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#fff', fontSize: '20px', margin: '0 0 4px 0' }}>🔥 Активные аукционы</h2>
        <p style={{ color: '#8899aa', fontSize: '13px', margin: 0 }}>Делайте ставки и выигрывайте сид-фразы</p>
      </div>
      {auctions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#8899aa' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>📭</div>
          <div>Нет активных аукционов</div>
        </div>
      ) : auctions.map((a: any) => (
        <div key={a.id} onClick={() => onSelect(a.id)} style={{ background: '#1a2332', borderRadius: '16px', padding: '16px', marginBottom: '12px', border: '1px solid #2a3a4a', cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>{a.title}</div>
            <div style={{ color: '#00d4ff', fontSize: '14px', fontWeight: 600 }}>{a.walletBalance || 0} TON</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: '#8899aa', fontSize: '13px' }}>Текущая ставка</span>
            <span style={{ color: '#fff', fontSize: '13px' }}>{a.currentBid || 0} TON</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#8899aa', fontSize: '13px' }}>Участников</span>
            <span style={{ color: '#fff', fontSize: '13px' }}>{a.currentParticipants || 0}/{a.maxParticipants || 0}</span>
          </div>
          <button style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, #00d4ff, #7b2ff2)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Сделать ставку</button>
        </div>
      ))}
    </div>
  );
};

export default Auctions;