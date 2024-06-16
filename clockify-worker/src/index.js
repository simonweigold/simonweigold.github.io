import { Hono } from 'hono';

const app = new Hono();

app.get('/bitcoin-price', async (c) => {
  try {
    //const response = await fetch('https://api.exchange.coinbase.com/products/BTC-USD/ticker', {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    const text = await response.text();
    console.log(`Response status: ${response.status}`);
    console.log(`Response status text: ${response.statusText}`);
    console.log(`Response body: ${text}`);

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = JSON.parse(text);
    return c.json(data);
  } catch (error) {
    console.error(error.message);
    return c.json({ error: error.message }, 500);
  }
});

export default app;
