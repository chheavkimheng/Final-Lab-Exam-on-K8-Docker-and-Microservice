const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const PORT = process.env.PORT || 3000;
const REGISTRATION_URL = process.env.REGISTRATION_URL || 'http://localhost:3001';
const UPDATE_URL = process.env.UPDATE_URL || 'http://localhost:3002';

app.get('/health', (req, res) => res.json({ service: 'api-gateway', status: 'ok' }));

// All client requests come in here and are forwarded to the right microservice
app.use(createProxyMiddleware('/register', { target: REGISTRATION_URL, changeOrigin: true }));
app.use(createProxyMiddleware('/update', { target: UPDATE_URL, changeOrigin: true }));

app.listen(PORT, () => console.log(`API gateway running on port ${PORT}`));