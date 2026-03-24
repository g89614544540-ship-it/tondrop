const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://idpzpzxjwtlzljcsqkil.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkcHpwenhqd3RsemxqY3Nxa2lsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDI4Nzk4MSwiZXhwIjoyMDg5ODYzOTgxfQ.SqCzBod47lKZPvadzUBhYQ5SF_Ywd8ouIpzvGwINx4c'
);

const CRYPTO_BOT_TOKEN = '554913:AADvDdA23vtZnXhRRUIK1lwBHzbdOWB6aml';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: false });
  }

  try {
    const { userId, amount } = req.body;

    if (!userId || !amount || amount <= 0) {
      return res.status(200).json({ ok: false, error: 'Invalid data' });
    }

    // Проверяем баланс
    const { data: user } = await supabase
      .from('users').select('balance').eq('id', userId).single();

    if (!user || user.balance < amount) {
      return res.status(200).json({ ok: false, error: 'Insufficient balance' });
    }

    // Создаём чек в Crypto Bot
    const response = await fetch('https://pay.crypt.bot/api/createCheck', {
      method: 'POST',
      headers: {
        'Crypto-Pay-API-Token': CRYPTO_BOT_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        asset: 'TON',
        amount: String(amount)
      })
    });

    const data = await response.json();

    if (data.ok && data.result) {
      // Списываем баланс
      const newBalance = user.balance - amount;
      await supabase.from('users').update({ balance: newBalance }).eq('id', userId);

      return res.status(200).json({
        ok: true,
        checkUrl: data.result.bot_check_url,
        balance: newBalance
      });
    } else {
      return res.status(200).json({ ok: false, error: 'Failed to create check' });
    }
  } catch (error) {
    return res.status(200).json({ ok: false, error: 'Server error' });
  }
};