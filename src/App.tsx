import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Auctions from './pages/Auctions';
import AuctionDetail from './pages/AuctionDetail';
import Friends from './pages/Friends';
import Wallet from './pages/Wallet';
import Admin from './pages/Admin';
import './App.css';

const App: React.FC = () => {
  const [page, setPage] = useState('home');
  const [balance, setBalance] = useState(0);
  const [selectedAuction, setSelectedAuction] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [auctions, setAuctions] = useState<any[]>([]);

  const userId = '123';

  useEffect(() => {
    fetch(`/api/balance?userId=${userId}`)
      .then(res => res.json())
      .then(data => setBalance(data.balance || 0))
      .catch(err => console.error('Balance error:', err));
  }, []);

  const handleDiamondClick = () => {
    if (isAdmin) return;
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 10) {
      setShowPasswordModal(true);
      setClickCount(0);
    }
  };

  const handlePasswordSubmit = () => {
    if (password === 'Buy Gram') {
      setIsAdmin(true);
      setShowPasswordModal(false);
      setPassword('');
    } else {
      alert('Неверный пароль');
      setPassword('');
      setShowPasswordModal(false);
    }
  };

  const handleBid = (auctionId: number, amount: number) => {
    if (amount > balance) {
      alert('Недостаточно средств! Пополните баланс.');
      return;
    }
    setBalance(prev => prev - amount);
    setAuctions(prev => prev.map(a =>
      a.id === auctionId ? { ...a, currentBid: a.currentBid + amount, totalBids: a.totalBids + 1, currentParticipants: a.currentParticipants + 1 } : a
    ));
    alert('Ставка ' + amount + ' TON принята!');
  };

  const handleDeposit = (amount: number) => {
    fetch('/api/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBalance(data.newBalance);
        }
      })
      .catch(err => console.error('Deposit error:', err));
  };

  const handleWithdraw = (amount: number) => {
    if (amount > balance) {
      alert('Недостаточно средств!');
      return;
    }
    alert('Заявка на вывод ' + amount + ' TON создана.');
  };

  const handleCreateAuction = (data: any) => {
    const now = Date.now();
    const newAuction = {
      id: now,
      title: data.title,
      seedPhrase: data.seedPhrase,
      currentBid: 0,
      currentParticipants: 0,
      maxParticipants: data.maxParticipants,
      totalBids: 0,
      status: 'active',
      endsAt: now + data.endsInHours * 3600000,
      bids: []
    };
    setAuctions(prev => [...prev, newAuction]);
  };

  const handleDeleteAuction = (id: number) => {
    setAuctions(prev => prev.filter(a => a.id !== id));
  };

  const handleStopAuction = (id: number) => {
    setAuctions(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'stopped' } : a
    ));
  };

  const activeAuctions = auctions.filter(a => a.status === 'active');

  const renderPage = () => {
    if (page === 'admin' && isAdmin) {
      return <Admin auctions={auctions} onCreate={handleCreateAuction} onDelete={handleDeleteAuction} onStop={handleStopAuction} onBack={() => setPage('home')} />;
    }
    if (selectedAuction) {
      const auction = auctions.find(a => a.id === selectedAuction);
      if (auction) return <AuctionDetail auction={auction} balance={balance} onBid={handleBid} onBack={() => setSelectedAuction(null)} />;
    }
    switch (page) {
      case 'auctions': return <Auctions auctions={activeAuctions} onSelect={(id) => setSelectedAuction(id)} />;
      case 'friends': return <Friends count={0} earnings={0} onWithdraw={() => {}} />;
      case 'wallet': return <Wallet balance={balance} onDeposit={handleDeposit} onWithdraw={handleWithdraw} />;
      default: return <Home balance={balance} friends={0} auctions={activeAuctions.length} isAdmin={isAdmin} onDiamondClick={handleDiamondClick} />;
    }
  };

  return (
    <div style={{ background: '#0d1520', minHeight: '100vh', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div style={{ maxWidth: '420px', margin: '0 auto', padding: '16px', paddingBottom: '80px' }}>
        {selectedAuction && (
          <button onClick={() => setSelectedAuction(null)} style={{ background: 'none', border: 'none', color: '#00d4ff', fontSize: '14px', cursor: 'pointer', marginBottom: '10px', padding: 0 }}>
            ← Назад
          </button>
        )}
        {renderPage()}
      </div>

      {showPasswordModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#1a2332', borderRadius: '16px', padding: '24px', width: '300px', border: '1px solid #2a3a4a' }}>
            <div style={{ color: '#fff', fontSize: '16px', fontWeight: 600, marginBottom: '16px', textAlign: 'center' }}>
              🔐 Введите пароль
            </div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePasswordSubmit()}
              placeholder="Пароль..."
              style={{ width: '100%', padding: '12px', background: '#0d1520', border: '1px solid #2a3a4a', borderRadius: '10px', color: '#fff', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box', textAlign: 'center' }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setShowPasswordModal(false); setPassword(''); }} style={{ flex: 1, padding: '10px', background: '#ff444422', border: '1px solid #ff4444', borderRadius: '10px', color: '#ff4444', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Отмена
              </button>
              <button onClick={handlePasswordSubmit} style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, #00d4ff, #7b2ff2)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                Войти
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <button onClick={() => { setPage('admin'); setSelectedAuction(null); }} style={{ position: 'fixed', top: '10px', right: '10px', background: '#ff990033', border: '1px solid #ff9900', borderRadius: '10px', padding: '8px 14px', color: '#ffaa00', fontSize: '13px', fontWeight: 600, cursor: 'pointer', zIndex: 1000 }}>
          🔧 Админ
        </button>
      )}
      <NavBar current={page} onNavigate={(p: string) => { setPage(p); setSelectedAuction(null); }} />
    </div>
  );
};

export default App;