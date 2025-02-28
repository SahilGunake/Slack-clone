import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import { db } from './firebaseAdmin.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

const users = [{ email: 'user@example.com', password: 'password123' }];

// JWT Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    const token = jwt.sign({ email }, 'secret', { expiresIn: '1h' });
    res.json({ token, user: { email } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    res.json({ user: { email: decoded.email } });
  });
});

// Get Messages from Firestore
app.get('/api/messages', async (req, res) => {
  try {
    const snapshot = await db.collection('messages').orderBy('timestamp').get();
    const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Save Message to Firestore and Emit via WebSockets
app.post('/api/messages', async (req, res) => {
  try {
    const { text, user } = req.body;
    const newMessage = {
      text,
      user,
      timestamp: new Date(),
    };
    const docRef = await db.collection('messages').add(newMessage);
    newMessage.id = docRef.id;

    io.emit('newMessage', newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

app.post('/api/messages', verifyToken, async (req, res) => {
    const { text } = req.body;
    const { uid, email } = req.user;
  
    try {
      const newMessage = {
        text,
        userId: uid,
        email,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      };
      await db.collection('messages').add(newMessage);
      res.status(201).json({ message: 'Message sent successfully!' });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// WebSockets for Real-Time Updates
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('sendMessage', async (message) => {
    io.emit('newMessage', message);
  });

  socket.on('disconnect', () => console.log('User disconnected'));
});

server.listen(4000, () => console.log('Server running on port 4000'));
