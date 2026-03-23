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
  const [balance, setBalance] = useState(0);
  const [selectedAuction, setSelectedAuction] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleDiamondClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 10) {
      setIsAdmin(true);
      setClickCount(0);
    }
  };

  const [auctions, setAuctions] = useState<any[]>([]);

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

  const handleDeposit = (_amount: number) => {
    window.open('https://t.me/CryptoBot?start=pay', '_blank');
    alert('После оплаты через Crypto Bot баланс обновится автоматически.');
  };

  const handleWithdraw = (amount: number) => {
    if (amount > balance) {
      alert('Недостаточно средств!');
      return;
    }
    alert('Заявка на вывод ' + amount + ' TON создана. Средства поступят в течение 24 часов.');
  };

  const handleCreateAuction = (data: any) => {
    const newAuction = {
      id: Date.now(),
      title: data.title,
      seedPhrase: data.seedPhrase,
      currentBid: 0,
      currentParticipants: 0,
      maxParticipants: data.maxParticipants,
      totalBids: 0,
      status: 'active',
      endsInHours: data.endsInHours
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
          <button onClick={() => setSelectedAuction(null)} style={{ background: 'none', border: 'none', color: '#00d4ff', fontSize: '14px', cursor: 'pointer', marginBottom: '10px', padding: 0 }}>← Назад</button>
        )}
        {renderPage()}
      </div>
      {isAdmin && (
        <button onClick={() => { setPage('admin'); setSelectedAuction(null); }} style={{ position: 'fixed', top: '10px', right: '10px', background: '#ff990033', border: '1px solid #ff9900', borderRadius: '10px', padding: '8px 14px', color: '#ffaa00', fontSize: '13px', fontWeight: 600, cursor: 'pointer', zIndex: 1000 }}>👑 Админ</button>
      )}
      <NavBar current={page} onNavigate={(p: string) => { setPage(p); setSelectedAuction(null); }} />
    </div>
  );
};

export default App;