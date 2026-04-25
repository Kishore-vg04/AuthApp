require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.json());

// CORS setup for your frontend
app.use(cors({
  origin: 'https://authapp-2-k96u.onrender.com',
  credentials: true,
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

// Test GET route
app.get('/', (req, res) => {
  res.send('API Running');
});

// Routes
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

// Error handling middleware (simple example)
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));