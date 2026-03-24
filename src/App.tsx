import React, { useState, useEffect } from 'react';
import supabase from './supabase';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Auctions from './pages/Auctions';
import AuctionDetail from './pages/AuctionDetail';
import Friends from './pages/Friends';
import Wallet from './pages/Wallet';
import Admin from './pages/Admin';
import './App.css';

const CRYPTO_BOT_TOKEN = '554913:AADvDdA23vtZnXhRRUIK1lwBHzbdOWB6aml';

const getTelegramUserId = (): string => {
  try {
    const tg = (window as any).Telegram?.WebApp;
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      return String(tg.initDataUnsafe.user.id);
    }
  } catch (e) {}
  return 'guest_browser';
};

const generateReferralCode = (userId: string): string => {
  return 'TD_' + userId;
};

const App: React.FC = () => {
  const [page, setPage] = useState('home');
  const [balance, setBalance] = useState(0);
  const [selectedAuction, setSelectedAuction] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [auctions, setAuctions] = useState<any[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState(0);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
    }
    const id = getTelegramUserId();
    setUserId(id);
  }, []);

  const loadUserData = async () => {
    if (!userId) return;
    const { data } = await supabase.from('users').select('*').eq('id', userId).single();
    if (data) {
      setBalance(data.balance || 0);
      setReferralCode(data.referral_code || generateReferralCode(userId));
      setReferralEarnings(data.referral_earnings || 0);
    } else {
      const code = generateReferralCode(userId);
      const tg = (window as any).Telegram?.WebApp;
      const startParam = tg?.initDataUnsafe?.start_param || '';
      await supabase.from('users').insert({
        id: userId,
        balance: 0,
        referral_code: code,
        referred_by: startParam || null,
        referral_earnings: 0
      });
      if (startParam) {
        await supabase.from('referrals').insert({
          referrer_id: startParam.replace('TD_', ''),
          referred_id: userId,
          earned: 0
        });
      }
      setReferralCode(code);
      setBalance(0);
    }
  };

  const loadReferrals = async () => {
    if (!userId) return;
    const { count } = await supabase
      .from('referrals')
      .select('*', { count: 'exact' })
      .eq('referrer_id', userId);
    setReferralCount(count || 0);
  };

  const loadAuctions = async () => {
    const { data } = await supabase
      .from('auctions')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) {
      setAuctions(data.map(a => ({
        id: a.id,
        title: a.title,
        seedPhrase: a.seed_phrase,
        currentBid: a.current_bid,
        currentParticipants: a.current_participants,
        maxParticipants: a.max_participants,
        totalBids: a.total_bids,
        status: a.status,
        endsAt: a.ends_at,
        bids: []
      })));
    }
  };

  useEffect(() => {
    if (userId) {
      loadUserData();
      loadReferrals();
      loadAuctions();
      const interval = setInterval(() => {
        loadUserData();
        loadAuctions();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const updateBalance = async (newBalance: number) => {
    await supabase.from('users').upsert({ id: userId, balance: newBalance });
    setBalance(newBalance);
  };

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

  const handleBid = async (auctionId: number, amount: number) => {
    if (amount > balance) {
      alert('Недостаточно средств! Пополните баланс.');
      return;
    }
    const newBalance = balance - amount;
    await updateBalance(newBalance);
    await supabase.from('bids').insert({
      auction_id: auctionId,
      user_id: userId,
      amount: amount
    });
    const auction = auctions.find(a => a.id === auctionId);
    if (auction) {
      await supabase.from('auctions').update({
        current_bid: auction.currentBid + amount,
        total_bids: auction.totalBids + 1,
        current_participants: auction.currentParticipants + 1
      }).eq('id', auctionId);
    }
    await loadAuctions();
    const { data: userData } = await supabase.from('users').select('referred_by').eq('id', userId).single();
    if (userData?.referred_by) {
      const referrerId = userData.referred_by.replace('TD_', '');
      const bonus = amount * 0.05;
      const { data: referrer } = await supabase.from('users').select('balance, referral_earnings').eq('id', referrerId).single();
      if (referrer) {
        await supabase.from('users').update({
          balance: referrer.balance + bonus,
          referral_earnings: (referrer.referral_earnings || 0) + bonus
        }).eq('id', referrerId);
      }
    }
    alert('Ставка ' + amount + ' TON принята!');
  };

  const handleDeposit = async (amount: number) => {
    try {
      const response = await fetch('https://pay.crypt.bot/api/createInvoice', {
        method: 'POST',
        headers: {
          'Crypto-Pay-API-Token': CRYPTO_BOT_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          asset: 'TON',
          amount: String(amount),
          description: 'TonDrop deposit',
          payload: JSON.stringify({ userId, amount })
        })
      });
      const data = await response.json();
      if (data.ok && data.result) {
        const invoiceId = data.result.invoice_id;
        const tg = (window as any).Telegram?.WebApp;
        if (tg) {
          tg.openTelegramLink('https://t.me/CryptoBot?start=' + invoiceId);
        } else {
          window.open(data.result.pay_url, '_blank');
        }
        let checks = 0;
        const checker = setInterval(async () => {
          checks++;
          if (checks > 60) { clearInterval(checker); return; }
          try {
            const checkRes = await fetch('/api/check-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ invoiceId, userId, amount })
            });
            const checkData = await checkRes.json();
            if (checkData.paid) {
              clearInterval(checker);
              setBalance(checkData.balance);
              alert('Оплата получена! +' + amount + ' TON');
            }
          } catch (e) {}
        }, 5000);
      } else {
        alert('Ошибка создания инвойса');
      }
    } catch (err) {
      alert('Ошибка сети');
    }
  };

  const handleWithdraw = async (amount: number) => {
    if (amount > balance || amount <= 0) {
      alert('Недостаточно средств!');
      return;
    }
    if (amount < 1) {
      alert('Минимальный вывод: 1 TON');
      return;
    }
    const newBalance = balance - amount;
    await updateBalance(newBalance);
    alert('Заявка на вывод ' + amount + ' TON создана! Средства поступят в течение 24 часов.');
  };

  const handleReferralWithdraw = async () => {
    if (referralEarnings <= 0) {
      alert('Нет реферальных начислений');
      return;
    }
    const newBalance = balance + referralEarnings;
    await supabase.from('users').update({
      balance: newBalance,
      referral_earnings: 0
    }).eq('id', userId);
    setBalance(newBalance);
    setReferralEarnings(0);
    alert('Реферальные ' + referralEarnings + ' TON переведены на баланс!');
  };

  const handleCreateAuction = async (data: any) => {
    const now = Date.now();
    const newAuction = {
      id: now,
      title: data.title,
      seed_phrase: data.seedPhrase,
      current_bid: 0,
      current_participants: 0,
      max_participants: data.maxParticipants,
      total_bids: 0,
      status: 'active',
      ends_at: now + data.endsInHours * 3600000
    };
    await supabase.from('auctions').insert(newAuction);
    await loadAuctions();
  };

  const handleDeleteAuction = async (id: number) => {
    await supabase.from('auctions').delete().eq('id', id);
    await loadAuctions();
  };

  const handleStopAuction = async (id: number) => {
    await supabase.from('auctions').update({ status: 'stopped' }).eq('id', id);
    await loadAuctions();
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
      case 'friends': return <Friends count={referralCount} earnings={referralEarnings} onWithdraw={handleReferralWithdraw} referralCode={referralCode} botUsername="TonDrop_bot" />;
      case 'wallet': return <Wallet balance={balance} onDeposit={handleDeposit} onWithdraw={handleWithdraw} />;
      default: return <Home balance={balance} friends={referralCount} auctions={activeAuctions.length} isAdmin={isAdmin} onDiamondClick={handleDiamondClick} />;
    }
  };

  if (!userId) {
    return (
      <div style={{ background: '#0d1520', minHeight: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>💎</div>
          <div style={{ fontSize: '16px', color: '#8892a0' }}>Загрузка...</div>
        </div>
      </div>
    );
  }

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
              Введите пароль
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
          Админ
        </button>
      )}
      <NavBar current={page} onNavigate={(p: string) => { setPage(p); setSelectedAuction(null); }} />
    </div>
  );
};

export default App;