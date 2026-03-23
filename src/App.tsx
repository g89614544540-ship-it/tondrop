import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Auctions from './pages/Auctions';
import AuctionDetail from './pages/AuctionDetail';
import Friends from './pages/Friends';
import Wallet from './pages/Wallet';
import Admin from './pages/Admin';

const API = 'http://localhost:3001/api';

type Page = 'home' | 'auctions' | 'auction-detail' | 'friends' | 'wallet' | 'admin';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [balance, setBalance] = useState(0);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');

  const userId = 'demo_user';

  useEffect(() => {
    loadBalance();
    loadAuctions();
  }, []);

  const loadBalance = async () => {
    try {
      const res = await fetch(API + '/users/' + userId);
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance || 0);
      }
    } catch (e) {
      console.log('Balance error', e);
    }
  };

  const loadAuctions = async () => {
    try {
      const res = await fetch(API + '/auctions');
      if (res.ok) {
        const data = await res.json();
        setAuctions(data || []);
      }
    } catch (e) {
      console.log('Auctions error', e);
    }
  };

  const handleSelectAuction = async (id: number) => {
    try {
      const res = await fetch(API + '/auctions/' + id);
      if (res.ok) {
        const data = await res.json();
        setSelectedAuction(data);
        setPage('auction-detail');
      }
    } catch (e) {
      console.log('Auction detail error', e);
      const found = auctions.find(a => a.id === id);
      if (found) {
        setSelectedAuction(found);
        setPage('auction-detail');
      }
    }
  };

  const handleBid = async (auctionId: number, amount: number) => {
    try {
      const res = await fetch(API + '/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, auctionId, amount })
      });
      if (res.ok) {
        alert('Ставка принята!');
        loadBalance();
        loadAuctions();
        handleSelectAuction(auctionId);
      } else {
        const err = await res.json();
        alert(err.error || 'Ошибка ставки');
      }
    } catch (e) {
      alert('Ошибка сети');
    }
  };

  const handleDeposit = async (amount: number) => {
    try {
      const res = await fetch(API + '/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.payUrl) {
          window.open(data.payUrl, '_blank');
        } else {
          alert('Баланс пополнен!');
          loadBalance();
        }
      } else {
        alert('Ошибка пополнения');
      }
    } catch (e) {
      alert('Ошибка сети');
    }
  };

  const handleWithdraw = async (amount: number) => {
    try {
      const res = await fetch(API + '/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount })
      });
      if (res.ok) {
        alert('Заявка на вывод создана!');
        loadBalance();
      } else {
        const err = await res.json();
        alert(err.error || 'Ошибка вывода');
      }
    } catch (e) {
      alert('Ошибка сети');
    }
  };

  const handleCreateAuction = async (data: any) => {
    try {
      const res = await fetch(API + '/auctions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        alert('Аукцион создан!');
        loadAuctions();
      } else {
        alert('Ошибка создания');
      }
    } catch (e) {
      alert('Ошибка сети');
    }
  };

  const handleDeleteAuction = async (id: number) => {
    try {
      await fetch(API + '/auctions/' + id, { method: 'DELETE' });
      loadAuctions();
    } catch (e) {
      alert('Ошибка');
    }
  };

  const handleStopAuction = async (id: number) => {
    try {
      await fetch(API + '/auctions/' + id + '/stop', { method: 'POST' });
      loadAuctions();
    } catch (e) {
      alert('Ошибка');
    }
  };

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) {
      setShowPasswordModal(true);
      setClickCount(0);
    }
    setTimeout(() => setClickCount(0), 3000);
  };

  const handlePasswordSubmit = () => {
    if (password === 'Buy Gram') {
      setIsAdmin(true);
      setPage('admin');
      setShowPasswordModal(false);
      setPassword('');
    } else {
      alert('Неверный пароль');
      setPassword('');
    }
  };

  const needsBackButton = page === 'auction-detail' || page === 'admin';

  return (
    <div style={{ background: '#0d1520', minHeight: '100vh', maxWidth: '500px', margin: '0 auto', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', position: 'relative', paddingBottom: '80px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #1a2332' }}>
        {needsBackButton ? (
          <button onClick={() => setPage(page === 'admin' ? 'home' : 'auctions')} style={{
            background: 'none', border: 'none', color: '#00d4ff', fontSize: '16px', cursor: 'pointer', padding: '4px 8px'
          }}>
            ← Назад
          </button>
        ) : (
          <div style={{ width: '70px' }} />
        )}

        <div onClick={handleLogoClick} style={{ cursor: 'pointer', textAlign: 'center' }}>
          <span style={{ color: '#fff', fontSize: '20px', fontWeight: 700 }}>💎 TonDrop</span>
        </div>

        <div style={{ width: '70px', textAlign: 'right' }}>
          {isAdmin && <span style={{ color: '#ffaa00', fontSize: '12px' }}>👑</span>}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 20px' }}>
        {page === 'home' && (
          <Home balance={balance} friends={0} auctions={auctions.length} isAdmin={isAdmin} />
        )}
        {page === 'auctions' && (
          <Auctions auctions={auctions} onSelect={handleSelectAuction} />
        )}
        {page === 'auction-detail' && selectedAuction && (
          <AuctionDetail auction={selectedAuction} balance={balance} onBid={handleBid} onBack={() => setPage('auctions')} />
        )}
        {page === 'friends' && (
          <Friends count={0} earnings={0} onWithdraw={() => {}} />
        )}
        {page === 'wallet' && (
          <Wallet balance={balance} onDeposit={handleDeposit} onWithdraw={handleWithdraw} />
        )}
        {page === 'admin' && (
          <Admin auctions={auctions} onCreate={handleCreateAuction} onDelete={handleDeleteAuction} onStop={handleStopAuction} onBack={() => setPage('home')} />
        )}
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '500px', background: '#0a1018',
        borderTop: '1px solid #1a2332', display: 'flex', padding: '8px 0',
        zIndex: 100
      }}>
        {[
          { id: 'home' as Page, icon: '🏠', label: 'Главная' },
          { id: 'auctions' as Page, icon: '🔥', label: 'Аукционы' },
          { id: 'friends' as Page, icon: '👥', label: 'Друзья' },
          { id: 'wallet' as Page, icon: '💰', label: 'Кошелёк' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setPage(tab.id)} style={{
            flex: 1, background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '4px 0'
          }}>
            <span style={{ fontSize: '20px' }}>{tab.icon}</span>
            <span style={{ fontSize: '10px', color: page === tab.id ? '#00d4ff' : '#8899aa' }}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 999
        }}>
          <div style={{ background: '#1a2332', borderRadius: '16px', padding: '24px', width: '300px', border: '1px solid #2a3a4a' }}>
            <div style={{ color: '#fff', fontSize: '18px', fontWeight: 600, textAlign: 'center', marginBottom: '16px' }}>
              🔐 Введите пароль
            </div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePasswordSubmit()}
              placeholder="Пароль администратора"
              style={{
                width: '100%', padding: '12px', background: '#0d1520', border: '1px solid #2a3a4a',
                borderRadius: '10px', color: '#fff', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box'
              }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { setShowPasswordModal(false); setPassword(''); }} style={{
                flex: 1, padding: '10px', background: '#2a3a4a', border: 'none',
                borderRadius: '10px', color: '#fff', fontSize: '14px', cursor: 'pointer'
              }}>Отмена</button>
              <button onClick={handlePasswordSubmit} style={{
                flex: 1, padding: '10px', background: 'linear-gradient(135deg, #00d4ff, #7b2ff2)',
                border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
              }}>Войти</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;