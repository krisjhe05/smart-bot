require('dotenv').config();
const express = require('express');
const { Spot, Futures } = require('binance');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// KUHA NG ENV VARIABLES
const API_KEY = process.env.API_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const MODE = process.env.MODE || 'real';

// SET BASE URL - ITO YUNG IMPORTANTE
const baseURL = MODE === 'testnet' 
  ? 'https://testnet.binancefuture.com' 
  : 'https://fapi.binance.com';

console.log(`Mode: ${MODE}`);
console.log(`Connecting to: ${baseURL}`);

// BINANCE CLIENT
const client = new Futures({
  apiKey: API_KEY,
  apiSecret: SECRET_KEY,
  baseURL: baseURL
});

let botRunning = false;
let balance = 0;

// API: KUHA NG BALANCE
app.get('/api/balance', async (req, res) => {
  try {
    const account = await client.account();
    const usdt = account.assets.find(a => a.asset === 'USDT');
    balance = usdt ? parseFloat(usdt.walletBalance) : 0;
    
    res.json({ 
      balance: balance.toFixed(2),
      status: 'Connected to ' + MODE 
    });
    console.log(`Balance fetched: $${balance}`);
  } catch (error) {
    console.error('API Error:', error.message);
    res.json({ balance: 0, error: error.message });
  }
});

// API: START BOT
app.post('/api/start', (req, res) => {
  botRunning = true;
  res.json({ status: 'Bot Started' });
  console.log('Bot Started');
});

// API: STOP BOT
app.post('/api/stop', (req, res) => {
  botRunning = false;
  res.json({ status: 'Bot Stopped' });
  console.log('Bot Stopped');
});

// SERVE HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
