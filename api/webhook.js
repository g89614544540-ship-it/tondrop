const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://idpzpzxjwtlzljcsqkil.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkcHpwenhqd3RsemxqY3Nxa2lsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDI4Nzk4MSwiZXhwIjoyMDg5ODYzOTgxfQ.SqCzBod47lKZPvadzUBhYQ5SF_Ywd8ouIpzvGwINx4c'
);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: true });
  }

  try {
    const update = req.body;

    if (update.update_type === 'invoice_paid') {
      const invoice = update.payload;
      const payloadData = JSON.parse(invoice.payload || '{}');
      const userId = payloadData.userId;
      const amount = parseFloat(payloadData.amount || invoice.amount);

      if (userId && amount > 0) {
        const { data: user } = await supabase
          .from('users')
          .select('balance')
          .eq('id', userId)
          .single();

        const currentBalance = user ? user.balance : 0;
        const newBalance = currentBalance + amount;

        await supabase
          .from('users')
          .upsert({ id: userId, balance: newBalance });
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(200).json({ ok: true });
  }
};