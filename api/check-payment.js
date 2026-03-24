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
    const { invoiceId, userId, amount } = req.body;

    const response = await fetch('https://pay.crypt.bot/api/getInvoices', {
      method: 'GET',
      headers: {
        'Crypto-Pay-API-Token': CRYPTO_BOT_TOKEN
      }
    });

    const data = await response.json();

    if (data.ok && data.result && data.result.items) {
      const invoice = data.result.items.find(
        i => String(i.invoice_id) === String(invoiceId) && i.status === 'paid'
      );

      if (invoice) {
        const { data: user } = await supabase
          .from('users').select('balance').eq('id', userId).single();
        const currentBalance = user ? user.balance : 0;
        const newBalance = currentBalance + parseFloat(amount);
        await supabase.from('users').upsert({ id: userId, balance: newBalance });
        return res.status(200).json({ ok: true, paid: true, balance: newBalance });
      }
    }

    return res.status(200).json({ ok: true, paid: false });
  } catch (error) {
    return res.status(200).json({ ok: false, error: 'server error' });
  }
};