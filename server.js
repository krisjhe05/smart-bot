const express = require('express');
const Binance = require('binance-api-node').default;
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const client = Binance({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.SECRET_KEY,
  httpBase: process.env.MODE === 'testnet' 
    ? 'https://testnet.binancefuture.com' 
    : 'https://fapi.binance.com'
});

console.log('Mode:', process.env.MODE);

app.get('/api/balance', async (req, res) => {
  try {
    const account = await client.futuresAccountInfo();
    const usdt = account.assets.find(a => a.asset === 'USDT');
    const balance = usdt ? parseFloat(usdt.walletBalance) : 0;
    res.json({ balance: balance.toFixed(2) });
    console.log('Balance:', balance);
  } catch (error) {
    console.error('API Error:', error.message);
    res.json({ balance: 0 });
  }
});

app.post('/api/start', (req, res) => res.json({ status: 'Bot Started' }));
app.post('/api/stop', (req, res) => res.json({ status: 'Bot Stopped' }));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
