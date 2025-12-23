// backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());           // Allow frontend to call backend
app.use(express.json());   // Parse JSON request body

// Simple test route
app.get('/', (req, res) => {
  res.send('ROJGAR-Boat backend is running ✅');
});

// Simple API route for frontend
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from ROJGAR-Boat backend!' });
});

// Choose a port
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
