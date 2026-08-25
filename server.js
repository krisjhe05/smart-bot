const express = require('express');
const Binance = require('binance-api-node').default;

const app = express();
app.use(express.json());

console.log('Mode:', process.env.MODE);

const client = Binance({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.SECRET_KEY,
  httpBase: process.env.MODE === 'testnet' 
    ? 'https://testnet.binancefuture.com' 
    : 'https://fapi.binance.com'
});

// DASHBOARD DIRECT DITO NA - WALA NG PUBLIC FOLDER
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Smart Bot</title>
    <style>
      body{background:#0a0a0a;color:#00ff88;font-family:Arial;text-align:center;padding:30px}
      .balance{font-size:40px;font-weight:bold}
      button{background:#00ff88;color:#000;border:none;padding:15px 30px;font-size:18px;border-radius:10px;margin:10px}
    </style>
    </head>
    <body>
      <h1>🤖 SMART FUTURES BOT</h1>
      <h2>USDT Balance</h2>
      <div class="balance" id="balance">Loading...</div>
      <button onclick="fetch('/api/start',{method:'POST'})">START</button>
      <button onclick="fetch('/api/stop',{method:'POST'})">STOP</button>
      <script>
        async function getBalance(){
          const res=await fetch('/api/balance');
          const data=await res.json();
          document.getElementById('balance').innerText='$'+data.balance+' USDT';
        }
        getBalance(); setInterval(getBalance,5000);
      </script>
    </body>
    </html>
  `);
});

// API BALANCE
app.get('/api/balance', async (req, res) => {
  try {
    const account = await client.futuresAccountInfo();
    const usdt = account.assets.find(a => a.asset === 'USDT');
    const balance = usdt ? parseFloat(usdt.walletBalance) : 0;
    res.json({ balance: balance.toFixed(2) });
  } catch (error) {
    res.json({ balance: 0 });
  }
});

app.post('/api/start', (req, res) => res.json({ status: 'Bot Started' }));
app.post('/api/stop', (req, res) => res.json({ status: 'Bot Stopped' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
