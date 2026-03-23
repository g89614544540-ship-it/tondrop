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
  const [maxParticipants, setMaxParticipants] = useState('100');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [hours, setHours] = useState('72');

  const handleCreate = () => {
    if (!title || !seedPhrase) {
      alert('Заполните название и сид-фразу!');
      return;
    }
    const words = seedPhrase.trim().split(/\s+/);
    if (words.length !== 24) {
      alert('Сид-фраза должна содержать ровно 24 слова! Сейчас: ' + words.length);
      return;
    }
    onCreate({
      title,
      maxParticipants: parseInt(maxParticipants) || 100,
      seedPhrase,
      endsInHours: parseInt(hours) || 72
    });
    setTitle('');
    setMaxParticipants('100');
    setSeedPhrase('');
    setHours('72');
    setShowForm(false);
    alert('Аукцион создан!');
  };

  const activeCount = auctions.filter((a: any) => a.status === 'active').length;
  const totalBids = auctions.reduce((s: number, a: any) => s + (a.totalBids || 0), 0);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#fff', fontSize: '20px', margin: '0 0 4px 0' }}>👑 Админ-панель</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        <div style={{ background: '#1a2332', borderRadius: '12px', padding: '12px', textAlign: 'center', border: '1px solid #2a3a4a' }}>
          <div style={{ color: '#fff', fontSize: '20px', fontWeight: 700 }}>{auctions.length}</div>
          <div style={{ color: '#8899aa', fontSize: '11px' }}>Всего</div>
        </div>
        <div style={{ background: '#1a2332', borderRadius: '12px', padding: '12px', textAlign: 'center', border: '1px solid #2a3a4a' }}>
          <div style={{ color: '#00ff88', fontSize: '20px', fontWeight: 700 }}>{activeCount}</div>
          <div style={{ color: '#8899aa', fontSize: '11px' }}>Активных</div>
        </div>
        <div style={{ background: '#1a2332', borderRadius: '12px', padding: '12px', textAlign: 'center', border: '1px solid #2a3a4a' }}>
          <div style={{ color: '#00d4ff', fontSize: '20px', fontWeight: 700 }}>{totalBids}</div>
          <div style={{ color: '#8899aa', fontSize: '11px' }}>Ставок</div>
        </div>
      </div>

      <button onClick={() => setShowForm(!showForm)} style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '12px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: showForm ? '#ff4444' : 'linear-gradient(135deg, #00d4ff, #7b2ff2)', color: '#fff' }}>
        {showForm ? '✕ Отмена' : '+ Создать аукцион'}
      </button>

      {showForm && (
        <div style={{ background: '#1a2332', borderRadius: '14px', padding: '16px', marginBottom: '16px', border: '1px solid #2a3a4a' }}>
          <div style={{ color: '#fff', fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Новый аукцион</div>
          <input placeholder="Название аукциона" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', background: '#0d1520', border: '1px solid #2a3a4a', borderRadius: '8px', color: '#fff', fontSize: '13px', marginBottom: '10px', boxSizing: 'border-box' }} />
          <input type="number" placeholder="Макс. участников" value={maxParticipants} onChange={e => setMaxParticipants(e.target.value)} style={{ width: '100%', padding: '10px', background: '#0d1520', border: '1px solid #2a3a4a', borderRadius: '8px', color: '#fff', fontSize: '13px', marginBottom: '10px', boxSizing: 'border-box' }} />
          <textarea rows={4} placeholder="Сид-фраза (24 слова через пробел)" value={seedPhrase} onChange={e => setSeedPhrase(e.target.value)} style={{ width: '100%', padding: '10px', background: '#0d1520', border: '1px solid #2a3a4a', borderRadius: '8px', color: '#fff', fontSize: '13px', marginBottom: '4px', boxSizing: 'border-box', resize: 'none' }} />
          <div style={{ color: '#8899aa', fontSize: '11px', marginBottom: '10px' }}>Слов: {seedPhrase.trim() ? seedPhrase.trim().split(/\s+/).length : 0} / 24</div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
            {[{ v: '1', l: '1ч' }, { v: '6', l: '6ч' }, { v: '24', l: '1д' }, { v: '72', l: '3д' }, { v: '168', l: '7д' }].map(d => (
              <button key={d.v} onClick={() => setHours(d.v)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer', background: hours === d.v ? '#00d4ff' : '#0d1520', color: hours === d.v ? '#000' : '#8899aa' }}>{d.l}</button>
            ))}
          </div>
          <button onClick={handleCreate} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #00d4ff, #7b2ff2)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>✓ Создать аукцион</button>
        </div>
      )}

      {auctions.map((a: any) => (
        <div key={a.id} style={{ background: '#1a2332', borderRadius: '14px', padding: '14px', marginBottom: '10px', border: '1px solid #2a3a4a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ color: '#fff', fontSize: '15px', fontWeight: 600 }}>{a.title}</div>
            <div style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: a.status === 'active' ? '#00ff8822' : '#ff444422', color: a.status === 'active' ? '#00ff88' : '#ff4444' }}>
              {a.status === 'active' ? 'Активен' : 'Завершён'}
            </div>
          </div>
          <div style={{ color: '#8899aa', fontSize: '12px', marginBottom: '8px' }}>
            Ставок: {a.totalBids || 0} | Участников: {a.currentParticipants || 0}/{a.maxParticipants}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {a.status === 'active' && (
              <button onClick={() => onStop(a.id)} style={{ flex: 1, padding: '8px', background: '#ff990022', border: '1px solid #ff990044', borderRadius: '8px', color: '#ff9900', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>⏹ Стоп</button>
            )}
            <button onClick={() => onDelete(a.id)} style={{ flex: 1, padding: '8px', background: '#ff444422', border: '1px solid #ff444444', borderRadius: '8px', color: '#ff4444', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>🗑 Удалить</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Admin;