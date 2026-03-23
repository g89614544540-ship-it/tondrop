import React, { useState } from 'react';
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
  const [balance, setBalance] = useState(10);
  const [selectedAuction, setSelectedAuction] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Проверяем URL на админ-ключ
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'secret2024') {
      setIsAdmin(true);
    }
  }, []);

  const [auctions, setAuctions] = useState([
    { id: 1, title: 'TON Wallet #1', walletBalance: 150, currentBid: 2.5, currentParticipants: 34, maxParticipants: 100, totalBids: 85, status: 'active' },
    { id: 2, title: 'TON Wallet #2', walletBalance: 500, currentBid: 8.0, currentParticipants: 67, maxParticipants: 200, totalBids: 201, status: 'active' },
    { id: 3, title: 'TON Wallet #3', walletBalance: 75, currentBid: 1.0, currentParticipants: 12, maxParticipants: 50, totalBids: 24, status: 'active' },
  ]);

  const handleBid = (auctionId: number, amount: number) => {
    if (amount > balance) {
      alert('Недостаточно средств!');
      return;
    }
    setBalance(prev => prev - amount);
    setAuctions(prev => prev.map(a =>
      a.id === auctionId ? { ...a, currentBid: a.currentBid + amount, totalBids: a.totalBids + 1, currentParticipants: a.currentParticipants + 1 } : a
    ));
    alert(`Ставка ${amount} TON принята!`);
  };

  const handleDeposit = (amount: number) => {
    setBalance(prev => prev + amount);
    alert(`Пополнено на ${amount} TON`);
  };

  const handleWithdraw = (amount: number) => {
    if (amount > balance) {
      alert('Недостаточно средств!');
      return;
    }
    setBalance(prev => prev - amount);
    alert(`Выведено ${amount} TON`);
  };

  const handleCreateAuction = (data: any) => {
    const newAuction = {
      id: Date.now(),
      title: data.title,
      walletBalance: data.walletBalance,
      currentBid: 0,
      currentParticipants: 0,
      maxParticipants: data.maxParticipants,
      totalBids: 0,
      status: 'active'
    };
    setAuctions(prev => [...prev, newAuction]);
    alert('Аукцион создан!');
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
      if (auction) {
        return <AuctionDetail auction={auction} balance={balance} onBid={handleBid} onBack={() => setSelectedAuction(null)} />;
      }
    }

    switch (page) {
      case 'auctions':
        return <Auctions auctions={activeAuctions} onSelect={(id) => setSelectedAuction(id)} />;
      case 'friends':
        return <Friends count={3} earnings={1.5} onWithdraw={() => handleDeposit(1.5)} />;
      case 'wallet':
        return <Wallet balance={balance} onDeposit={handleDeposit} onWithdraw={handleWithdraw} />;
      default:
        return <Home balance={balance} friends={3} auctions={activeAuctions.length} isAdmin={isAdmin} />;
    }
  };

  return (
    <div style={{ background: '#0d1520', minHeight: '100vh', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div style={{ maxWidth: '420px', margin: '0 auto', padding: '16px', paddingBottom: '80px' }}>
        {selectedAuction && (
          <button onClick={() => setSelectedAuction(null)} style={{ background: 'none', border: 'none', color: '#00d4ff', fontSize: '14px', cursor: 'pointer', marginBottom: '10px', padding: 0 }}>← Назад</button>
        )}
        {renderPage()}
      </div>

      {isAdmin && (
        <button onClick={() => { setPage('admin'); setSelectedAuction(null); }} style={{ position: 'fixed', top: '10px', right: '10px', background: '#ff990033', border: '1px solid #ff9900', borderRadius: '10px', padding: '8px 14px', color: '#ffaa00', fontSize: '13px', fontWeight: 600, cursor: 'pointer', zIndex: 1000 }}>👑 Админ</button>
      )}

      <NavBar current={page} onNavigate={(p) => { setPage(p); setSelectedAuction(null); }} />
    </div>
  );
};

export default App;