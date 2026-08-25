const express = require('express');
const Binance = require('binance-api-node').default;
const path = require('path');

const app = express();
app.use(express.json());

const client = Binance({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.SECRET_KEY,
  httpBase: process.env.MODE === 'testnet' 
    ? 'https://testnet.binancefuture.com' 
    : 'https://fapi.binance.com'
});

// API BALANCE
app.get('/api/balance', async (req, res) => {
  try {
    const account = await client.futuresAccountInfo();
    const usdt = account.assets.find(a => a.asset === 'USDT');
    res.json({ balance: usdt ? parseFloat(usdt.walletBalance).toFixed(2) : '0.00' });
  } catch (error) {
    console.log('Balance Error:', error.message);
    res.json({ balance: '0.00' });
  }
});

app.post('/api/start', (req, res) => res.json({ status: 'Started' }));
app.post('/api/stop', (req, res) => res.json({ status: 'Stopped' }));

// DASHBOARD - NASA MAIN LANG
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Running on ${PORT}`));
