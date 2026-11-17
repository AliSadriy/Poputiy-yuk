const express = require('express');
const path = require('path');
const { sendTelegramNotification } = require('./telegram');
const pool = require('./db');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let loads = [
  { id: '1', origin: 'Toshkent', destination: 'Samarqand', weight: '5 tonna', cargo_type: 'Standard' },
  { id: '2', origin: 'Buxoro', destination: 'Toshkent', weight: '3 tonna', cargo_type: 'Birga yuk (S сборный)' },
  { id: '3', origin: 'Fargona', destination: 'Andijon', weight: '2 tonna', cargo_type: 'Mo\'rt / Maxsus' },
  { id: '4', origin: 'Namangan', destination: 'Toshkent', weight: '10 tonna', cargo_type: 'Standard' },
  { id: '5', origin: 'Qashqadaryo', destination: 'Navoiy', weight: '7 tonna', cargo_type: 'Birga yuk (S сборный)' },
  { id: '6', origin: 'Xorazm', destination: 'Toshkent', weight: '4 tonna', cargo_type: 'Standard' },
  { id: '7', origin: 'Jizzax', destination: 'Samarqand', weight: '6 tonna', cargo_type: 'Mo\'rt / Maxsus' },
  { id: '8', origin: 'Surxondaryo', destination: 'Toshkent', weight: '8 tonna', cargo_type: 'Standard' },
  { id: '9', origin: 'Sirdaryo', destination: 'Guliston', weight: '1.5 tonna', cargo_type: 'Birga yuk (S сборный)' },
  { id: '10', origin: 'Zarafshon', destination: 'Navoiy', weight: '12 tonna', cargo_type: 'Standard' }
];

let trips = [
  { id: '1', origin: 'Samarqand', destination: 'Toshkent', date: '2026-11-20', vehicle_type: 'Tentli yuk mashinasi', driver_verified: true },
  { id: '2', origin: 'Toshkent', destination: 'Buxoro', date: '2026-11-21', vehicle_type: 'Refrijerator (Sovutgich)', driver_verified: false },
  { id: '3', origin: 'Andijon', destination: 'Fargona', date: '2026-11-22', vehicle_type: 'Klukov / Bortli', driver_verified: true },
  { id: '4', origin: 'Toshkent', destination: 'Namangan', date: '2026-11-23', vehicle_type: 'Samasval (Ag‘darma)', driver_verified: false },
  { id: '5', origin: 'Navoiy', destination: 'Qashqadaryo', date: '2026-11-24', vehicle_type: 'Mikroavtobus', driver_verified: true },
  { id: '6', origin: 'Toshkent', destination: 'Xorazm', date: '2026-11-25', vehicle_type: 'Tentli yuk mashinasi', driver_verified: false },
  { id: '7', origin: 'Samarqand', destination: 'Jizzax', date: '2026-11-26', vehicle_type: 'Refrijerator (Sovutgich)', driver_verified: true },
  { id: '8', origin: 'Toshkent', destination: 'Surxondaryo', date: '2026-11-27', vehicle_type: 'Klukov / Bortli', driver_verified: false },
  { id: '9', origin: 'Guliston', destination: 'Sirdaryo', date: '2026-11-28', vehicle_type: 'Mikroavtobus', driver_verified: true },
  { id: '10', origin: 'Navoiy', destination: 'Zarafshon', date: '2026-11-29', vehicle_type: 'Tentli yuk mashinasi', driver_verified: true }
];

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Poputniy Yuk API is running' });
});

app.get('/api/loads', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM loads ORDER BY id DESC');
    if (result.rows.length > 0) {
      return res.json(result.rows);
    }
  } catch (err) {
    // fallback to memory
  }
  res.json(loads);
});

app.post('/api/loads', async (req, res) => {
  const { origin, destination, weight, price, cargo_type } = req.body;
  let newLoad = { id: Date.now().toString(), origin, destination, weight, price, cargo_type: cargo_type || 'Standard' };
  try {
    const result = await pool.query(
      'INSERT INTO loads (origin, destination, weight, price, cargo_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [origin, destination, weight, price, cargo_type || 'Standard']
    );
    newLoad = result.rows[0];
  } catch (err) {
    loads.unshift(newLoad);
  }

  await sendTelegramNotification(`📦 *Yangi yuk qo'shildi!*\n\nQayerdan: ${origin}\nQayerga: ${destination}\nVazni: ${weight}${price ? '\nNarxi: ' + price : ''}\nTuri: ${cargo_type || 'Standard'}`);
  res.status(201).json(newLoad);
});

app.get('/api/trips', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trips ORDER BY id DESC');
    if (result.rows.length > 0) {
      return res.json(result.rows);
    }
  } catch (err) {
    // fallback to memory
  }
  res.json(trips);
});

app.post('/api/trips', async (req, res) => {
  const { origin, destination, date, vehicle_type, driver_verified } = req.body;
  let newTrip = { id: Date.now().toString(), origin, destination, date, vehicle_type: vehicle_type || 'Tentli yuk mashinasi', driver_verified: !!driver_verified };
  try {
    const result = await pool.query(
      'INSERT INTO trips (origin, destination, date, vehicle_type, driver_verified) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [origin, destination, date, vehicle_type || 'Tentli yuk mashinasi', !!driver_verified]
    );
    newTrip = result.rows[0];
  } catch (err) {
    trips.unshift(newTrip);
  }

  await sendTelegramNotification(`🚛 *Yangi bo'sh reys qo'shildi!*\n\nQayerdan: ${origin}\nQayerga: ${destination}\nSana: ${date}\nTransport: ${vehicle_type || 'Tentli yuk mashinasi'}${driver_verified ? '\n✅ Tasdiqlangan haydovchi (Verified)' : ''}`);
  res.status(201).json(newTrip);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
