const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, 'data.json');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { users: [], events: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Simple middleware to protect routes
function authenticate(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ message: 'Missing authorization header' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid authorization format' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function ensureAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
}

// Auth endpoints: signup, login
app.post('/api/auth/signup', (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) return res.status(400).json({ message: 'Missing fields' });

  const data = readData();
  if (data.users.some(u => u.email === email)) return res.status(409).json({ message: 'User exists' });

  const user = { id: uuidv4(), email, password, role };
  data.users.push(user);
  writeData(data);

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  const data = readData();
  const user = data.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ user: { id: user.id, email: user.email, role: user.role }, token });
});

// Events endpoints
app.get('/api/events', (req, res) => {
  const data = readData();
  res.json(data.events);
});

app.get('/api/events/:id', (req, res) => {
  const data = readData();
  const ev = data.events.find(e => e.id === req.params.id);
  if (!ev) return res.status(404).json({ message: 'Not found' });
  res.json(ev);
});

// Update an event (admin)
app.put('/api/events/:id', authenticate, ensureAdmin, (req, res) => {
  const { title, description, image } = req.body;
  const data = readData();
  const idx = data.events.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  const ev = data.events[idx];
  const updated = { ...ev, title: title ?? ev.title, description: description ?? ev.description, image: image ?? ev.image };
  data.events[idx] = updated;
  writeData(data);
  res.json(updated);
});

// Get current user from token
app.get('/api/me', authenticate, (req, res) => {
  const data = readData();
  const user = data.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ id: user.id, email: user.email, role: user.role });
});

// Admin user CRUD
app.post('/api/users', authenticate, ensureAdmin, (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) return res.status(400).json({ message: 'Missing fields' });
  const data = readData();
  if (data.users.find(u => u.email === email)) return res.status(409).json({ message: 'User exists' });
  const user = { id: uuidv4(), email, password, role };
  data.users.push(user);
  writeData(data);
  res.status(201).json({ id: user.id, email: user.email, role: user.role });
});

app.put('/api/users/:id', authenticate, ensureAdmin, (req, res) => {
  const { email, password, role } = req.body;
  const data = readData();
  const idx = data.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  const u = data.users[idx];
  const updated = { ...u, email: email ?? u.email, password: password ?? u.password, role: role ?? u.role };
  data.users[idx] = updated;
  writeData(data);
  res.json({ id: updated.id, email: updated.email, role: updated.role });
});

app.delete('/api/users/:id', authenticate, ensureAdmin, (req, res) => {
  const data = readData();
  const idx = data.users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  const removed = data.users.splice(idx, 1)[0];
  writeData(data);
  res.json({ id: removed.id, email: removed.email, role: removed.role });
});

// Protected create/delete
app.post('/api/events', authenticate, ensureAdmin, (req, res) => {
  const { title, description, image } = req.body;
  if (!title || !image) return res.status(400).json({ message: 'Missing fields' });
  const data = readData();
  const ev = { id: uuidv4(), title, description: description || '', image };
  data.events.unshift(ev);
  writeData(data);
  res.status(201).json(ev);
});

app.delete('/api/events/:id', authenticate, ensureAdmin, (req, res) => {
  const data = readData();
  const idx = data.events.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Not found' });
  const removed = data.events.splice(idx, 1)[0];
  writeData(data);
  res.json(removed);
});

// Simple route to inspect users (admin only)
app.get('/api/users', authenticate, ensureAdmin, (req, res) => {
  const data = readData();
  res.json(data.users.map(u => ({ id: u.id, email: u.email, role: u.role })));
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
