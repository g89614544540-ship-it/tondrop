import React, { useState } from 'react';

interface Props {
  auctions: any[];
  onCreate: (data: any) => void;
  onDelete: (id: number) => void;
  onStop: (id: number) => void;
  onBack: () => void;
}

const Admin: React.FC<Props> = ({ auctions, onCreate, onDelete, onStop }) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [max, setMax] = useState('100');
  const [seed, setSeed] = useState('');
  const [hrs, setHrs] = useState('72');

  const handleCreate = () => {
    if (!title || !seed) {
      alert('Заполните название и сид-фразу!');
      return;
    }
    const words = seed.trim().split(/\s+/);
    if (words.length !== 24) {
      alert('Нужно 24 слова! Сейчас: ' + words.length);
      return;
    }
    onCreate({ title, maxParticipants: parseInt(max) || 100, seedPhrase: seed, endsInHours: parseInt(hrs) || 72 });
    setTitle('');
    setMax('100');
    setSeed('');
    setHrs('72');
    setShowForm(false);
    alert('Аукцион создан!');
  };

  const active = auctions.filter((a: any) => a.status === 'active').length;
  const bids = auctions.reduce((s: number, a: any) => s + (a.totalBids || 0), 0);

  const box = { background: '#1a2332', borderRadius: '12px', padding: '12px', textAlign: 'center' as const, border: '1px solid #2a3a4a' };
  const inp = { width: '100%', padding: '10px', background: '#0d1520', border: '1px solid #2a3a4a', borderRadius: '8px', color: '#fff', fontSize: '13px', marginBottom: '10px', boxSizing: 'border-box' as const };

  return (
    <div>
      <h2 style={{ color: '#fff', fontSize: '20px', margin: '0 0 16px 0' }}>🔧 Админ-панель</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        <div style={box}>
          <div style={{ color: '#fff', fontSize: '20px', fontWeight: 700 }}>{auctions.length}</div>
          <div style={{ color: '#8899aa', fontSize: '11px' }}>Всего</div>
        </div>
        <div style={box}>
          <div style={{ color: '#00ff88', fontSize: '20px', fontWeight: 700 }}>{active}</div>
          <div style={{ color: '#8899aa', fontSize: '11px' }}>Активных</div>
        </div>
        <div style={box}>
          <div style={{ color: '#00d4ff', fontSize: '20px', fontWeight: 700 }}>{bids}</div>
          <div style={{ color: '#8899aa', fontSize: '11px' }}>Ставок</div>
        </div>
      </div>

      <button onClick={() => setShowForm(!showForm)} style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: showForm ? '#ff4444' : 'linear-gradient(135deg, #00d4ff, #7b2ff2)', color: '#fff' }}>
        {showForm ? '✕ Отмена' : '+ Создать аукцион'}
      </button>

      {showForm && (
        <div style={{ background: '#1a2332', borderRadius: '14px', padding: '16px', marginBottom: '16px', border: '1px solid #2a3a4a' }}>
          <div style={{ color: '#fff', fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Новый аукцион</div>
          <input placeholder="Название" value={title} onChange={e => setTitle(e.target.value)} style={inp} />
          <input type="number" placeholder="Макс. участников" value={max} onChange={e => setMax(e.target.value)} style={inp} />
          <textarea rows={4} placeholder="Сид-фраза (24 слова)" value={seed} onChange={e => setSeed(e.target.value)} style={{ ...inp, resize: 'none' as const }} />
          <div style={{ color: '#8899aa', fontSize: '11px', marginBottom: '10px' }}>
            Слов: {seed.trim() ? seed.trim().split(/\s+/).length : 0} / 24
          </div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
            {[['1','1ч'],['6','6ч'],['24','1д'],['72','3д'],['168','7д']].map(d => (
              <button key={d[0]} onClick={() => setHrs(d[0])} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer', background: hrs === d[0] ? '#00d4ff' : '#0d1520', color: hrs === d[0] ? '#000' : '#8899aa' }}>{d[1]}</button>
            ))}
          </div>
          <button onClick={handleCreate} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #00d4ff, #7b2ff2)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            ✓ Создать
          </button>
        </div>
      )}

      {auctions.map((a: any) => (
        <div key={a.id} style={{ background: '#1a2332', borderRadius: '14px', padding: '14px', marginBottom: '10px', border: '1px solid #2a3a4a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ color: '#fff', fontSize: '15px', fontWeight: 600 }}>{a.title}</div>
            <div style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: a.status === 'active' ? '#00ff8822' : '#ff444422', color: a.status === 'active' ? '#00ff88' : '#ff4444' }}>
              {a.status === 'active' ? 'Активен' : 'Стоп'}
            </div>
          </div>
          <div style={{ color: '#8899aa', fontSize: '12px', marginBottom: '8px' }}>
            Ставок: {a.totalBids || 0} | {a.currentParticipants || 0}/{a.maxParticipants}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {a.status === 'active' && (
              <button onClick={() => onStop(a.id)} style={{ flex: 1, padding: '8px', background: '#ff990022', border: '1px solid #ff990044', borderRadius: '8px', color: '#ff9900', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                ⏸ Стоп
              </button>
            )}
            <button onClick={() => onDelete(a.id)} style={{ flex: 1, padding: '8px', background: '#ff444422', border: '1px solid #ff444444', borderRadius: '8px', color: '#ff4444', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              🗑 Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Admin;