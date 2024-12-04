const express = require('express');
const cors = require('cors');
const { WebpayPlus } = require('transbank-sdk');
const { Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } = require('transbank-sdk');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuración de CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());

// Configuración de Transbank
const tx = new WebpayPlus.Transaction(new Options(
  IntegrationCommerceCodes.WEBPAY_PLUS,
  IntegrationApiKeys.WEBPAY,
  Environment.Integration
));

// Rutas
app.post('/api/webpay/create', async (req, res) => {
  try {
    const { buy_order, amount, return_url } = req.body;
    const sessionId = `session-${Date.now()}`;

    const response = await tx.create(buy_order, sessionId, amount, return_url);
    res.json(response);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/webpay/confirm', async (req, res) => {
  try {
    const { token } = req.body;
    const response = await tx.commit(token);
    res.json(response);
  } catch (error) {
    console.error('Error confirming transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
